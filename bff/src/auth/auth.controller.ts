import { Controller, Post, Body, Res, UnauthorizedException, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('social')
  async socialLogin(@Body() body: { provider: string; access_token: string; profile: any }, @Res({ passthrough: true }) res: Response) {
    const { provider, access_token, profile } = body;

    // Verify social token and get/create user
    const user = await this.authService.validateSocialLogin(provider, access_token, profile);

    // Generate tokens
    const { accessToken, refreshToken } = await this.authService.login(user);

    // Set Refresh Token in HttpOnly Cookie
    res.cookie('rfToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return {
      accessToken,
      expiresIn: 900, // 15 minutes
      userId: user.id,
      email: user.email,
      name: user.name,
    };
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['rfToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }

    const tokens = await this.authService.refreshTokens(refreshToken);

    // Optionally rotate refresh token
    // res.cookie('rfToken', tokens.refreshToken, { ...options });

    return {
      accessToken: tokens.accessToken,
      expiresIn: 900,
    };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('rfToken');
    return { success: true };
  }
}
