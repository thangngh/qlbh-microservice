import { Injectable, UnauthorizedException, ForbiddenException, Inject, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CredentialEntity } from '../users/entities/credential.entity';
import * as bcrypt from 'bcrypt';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(CredentialEntity)
    private readonly credentialRepository: Repository<CredentialEntity>,
    @Inject('USER_SERVICE') private readonly userClient: ClientKafka,
  ) { }

  async onModuleInit() {
    this.userClient.subscribeToResponseOf('user.create');
    this.userClient.subscribeToResponseOf('user.find_by_email');
    await this.userClient.connect();
  }

  async validateSocialLogin(provider: string, accessToken: string, profile: any) {
    // 1. Check if credential exists
    let credential = await this.credentialRepository.findOne({ where: { email: profile.email } });

    if (!credential) {
      // 2. If not, check/create user in User Service
      // We use Kafka request-response pattern here
      let user = await firstValueFrom(
        this.userClient.send('user.find_by_email', profile.email)
      );

      if (!user) {
        user = await firstValueFrom(
          this.userClient.send('user.create', {
            email: profile.email,
            name: profile.name,
            avatar: profile.picture || profile.avatar,
          })
        );
      }

      // 3. Create credential linked to userId
      credential = this.credentialRepository.create({
        email: profile.email,
        userId: user.id,
      });
      await this.credentialRepository.save(credential);
    }

    // Return credential with userId for token generation
    return credential;
  }

  async login(credential: CredentialEntity) {
    const payload = { email: credential.email, sub: credential.userId }; // Use userId from User Service
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.updateRefreshToken(credential.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      // Find credential by userId (sub) is tricky if we don't store credentialId in token
      // But we stored sub = userId. 
      // We need to find credential by userId.
      const credential = await this.credentialRepository.findOne({ where: { userId: payload.sub } });

      if (!credential || !credential.hashedRefreshToken) {
        throw new ForbiddenException('Access Denied');
      }

      const isMatch = await bcrypt.compare(refreshToken, credential.hashedRefreshToken);

      if (!isMatch) {
        console.warn(`Refresh token reuse detected for user ${credential.userId}`);
        await this.credentialRepository.update(credential.id, { hashedRefreshToken: null as any });
        throw new ForbiddenException('Access Denied - Token Reuse Detected');
      }

      const newPayload = { email: credential.email, sub: credential.userId };
      const newAccessToken = this.jwtService.sign(newPayload, { expiresIn: '15m' });
      const newRefreshToken = this.jwtService.sign(newPayload, { expiresIn: '7d' });

      await this.updateRefreshToken(credential.id, newRefreshToken);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async updateRefreshToken(credentialId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.credentialRepository.update(credentialId, { hashedRefreshToken: hash });
  }
}
