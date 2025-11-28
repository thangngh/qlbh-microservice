import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) { }

  async validateSocialLogin(provider: string, accessToken: string, profile: any) {
    // In a real app, you would:
    // 1. Verify the accessToken with the provider (Google/FB/GitHub) API to ensure it's valid and belongs to the user.
    // 2. Check if the user exists in your DB based on email/provider ID.
    // 3. Create the user if they don't exist.

    // Mock implementation for now
    console.log(`Validating ${provider} login for ${profile?.email}`);

    // Simulate finding/creating user
    const user = {
      id: 'mock-user-id-' + Date.now(),
      email: profile?.email || 'test@example.com',
      name: profile?.name || 'Test User',
    };

    return user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' }); // Should use a different secret/salt in prod

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      // Check if user still exists and if refresh token is valid (e.g. not revoked)

      const newPayload = { email: payload.email, sub: payload.sub };
      const accessToken = this.jwtService.sign(newPayload, { expiresIn: '15m' });

      return {
        accessToken,
        refreshToken, // Return same or new refresh token
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
