import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { OtpDto } from './dto/confirm-otp.dto';
import type { Response, Request } from 'express';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post("login")
    login(
        @Body() login: LoginDto,
        @Res({ passthrough: true }) res: Response
    ) {
        return this.authService.login(login, res)
    }

    @Post('confirm-otp')
    confirmOtp(
        @Body() otpDto: OtpDto,
        @Res({ passthrough: true }) res: Response
    ) {
        return this.authService.confirmOtp(res, otpDto)
    }

    @Post("token")
    getAccessToken(@Req() req: Request) {
        return this.authService.getAccessToken(req)
    }

    @Post("forgot-password")
    forgotPassword(@Body() data: ForgotPasswordDto) {
        return this.authService.forgotPassword(data)
    }

    @Post("reset-password")
    resetPassword(@Body() bodyData: ResetPasswordDto) {
        return this.authService.resetPassword(bodyData)
    }
}
