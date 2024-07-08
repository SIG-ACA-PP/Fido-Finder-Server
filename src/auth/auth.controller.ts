import {
  Body,
  Controller,
  Post,
  HttpStatus,
  HttpCode,
  Get,
  UseGuards,
  Req,
  ForbiddenException,
  InternalServerErrorException,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { GoogleOauthGuard } from './guard';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly redirectUrl: string;

  constructor(
    private authService: AuthService,
    config: ConfigService,
  ) {
    this.redirectUrl = config.get<string>('REDIRECT_CLIENT');
  }

  /**
   * Allows a user to sign in the app, must have been authenticated by google previously
   * @param authDto
   * @returns
   */
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() authDto: AuthDto) {
    if (process.env.MODE !== 'dev')
      throw new ForbiddenException(
        'This endpoint is only available in testing',
      );

    return this.authService.signIn(authDto);
  }

  /**
   *
   * @param authDto
   * @returns
   */
  @Post('signup')
  signUp(@Body() authDto: AuthDto) {
    if (process.env.MODE !== 'dev')
      throw new ForbiddenException(
        'This endpoint is only available in testing',
      );

    return this.authService.signUp(authDto);
  }

  /**
   * Allows a user to authenticate using Google
   */
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async auth() {}

  /**
   * Allows a user to authenticate using Google
   */
  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res) {
    try {
      const user: AuthDto | undefined = req.user as AuthDto;
      if (!user) throw new ForbiddenException('error authenticating user');
      const { access_token } = await this.authService.oAuthLogin(req.user);
      return res.redirect(
        `${this.redirectUrl}/auth/verify?token=${access_token}`,
      );
    } catch (err: any) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
