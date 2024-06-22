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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { GoogleOauthGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }

  @Post('signup')
  signUp(@Body() authDto: AuthDto) {
    return this.authService.signUp(authDto);
  }

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  googleAuthCallback(@Req() req) {
    try {
      const user: AuthDto | undefined = req.user as AuthDto;
      if (!user) throw new ForbiddenException('error authenticating user');
      return this.authService.oAuthLogin(req.user);
    } catch (err: any) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
