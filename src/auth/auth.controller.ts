import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { OtpDto } from './dto/confirm-otp.dto';
import type { Response, Request } from 'express';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiOperation({ summary: `This route is used for logging in to the system` })
    @ApiResponse({ status: 200, description: `OTP was sent successfully for email address` })
    @Post("login")
    login(
        @Body() login: LoginDto,
        @Res({ passthrough: true }) res: Response
    ) {
        return this.authService.login(login, res)
    }

    @ApiOperation({ summary: `This route is used for verifying the OTP that was sent to email ` })
    @ApiResponse({ status: 200, description: `successfully signed in` })
    @Post('confirm-otp')
    confirmOtp(
        @Body() otpDto: OtpDto,
        @Res({ passthrough: true }) res: Response
    ) {
        return this.authService.confirmOtp(res, otpDto)
    }

    @ApiOperation({ summary: `This route is used for renewing the ACCESS_TOKEN after it is expired in its period` })
    @ApiResponse({ status: 200, description: `success` })
    @Post("token")
    getAccessToken(@Req() req: Request) {
        return this.authService.getAccessToken(req)
    }

    @ApiOperation({ summary: `This route is used for taking the otp in order to reset the password when you forgot it` })
    @ApiResponse({ status: 200, description: `OTP was sent successfully for email address` })
    @Post("forgot-password")
    forgotPassword(@Body() data: ForgotPasswordDto) {
        return this.authService.forgotPassword(data)
    }

    @ApiOperation({ summary: `This route is used for renewing the password after verifying the OTP that was sent to email address` })
    @ApiResponse({ status: 200, description: `reset, successfully` })
    @Post("reset-password")
    resetPassword(@Body() bodyData: ResetPasswordDto) {
        return this.authService.resetPassword(bodyData)
    }
}
