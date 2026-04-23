import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Conflicts } from 'src/utils/check-existance';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Crypto } from 'src/utils/Crypto';
import { generateOtp } from 'src/utils/otp-generator';
import { sendMail } from 'src/utils/mail-service';
import { ISuccess } from 'src/utils/success.response';
import { delCache, getCache, setCache } from 'src/utils/cache-control';
import { OtpDto } from './dto/confirm-otp.dto';
import Token from 'src/utils/Token';
import type { Response, Request } from 'express';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { envCongig } from 'src/config/env.congig';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) { }

    async login(login: LoginDto, res: Response): Promise<ISuccess> {
        let { email, password } = login
        let user = await this.userRepo.findOne({
            where: { email }
        }) as User
        if (!user) {
            res.clearCookie("refreshToken")
            throw new UnauthorizedException(`The password or email is wrong`)
        }
        let isMatch = await Crypto.compare(password, user?.password)
        if (!isMatch) {
            res.clearCookie("refreshToken")
            throw new UnauthorizedException(`The password or eamil is wrong`)
        }

        let otp = generateOtp()
        setCache(email, otp)
        console.log(envCongig, otp)
        let sms = await sendMail(user.email, otp)
        
        console.log(sms)
        return {
            statusCode: 200,
            message: "success",
            data: {}
        }
    }
    async confirmOtp(res: Response, otpDto: OtpDto): Promise<ISuccess> {

        let { email, otp } = otpDto
        let user = await Conflicts.checkField({ email }, this.userRepo) as User
        let cacheData = await getCache(email)

        if (!cacheData || cacheData !== otp) {
            throw new BadRequestException(`OTP is incorrect or expired`)
        }
        let payload = { id: user?.id, full_name: user?.full_name, role: user?.role }
        delCache(email)

        let aToken = Token.getAccessToken(payload)
        let rToken = Token.getRefreshToken(res, payload)

        return {
            statusCode: 200,
            message: "You've signed in",
            data: {
                acess_token: aToken,
                refresh_token: rToken
            }
        }
    }

    async getAccessToken(req: Request): Promise<ISuccess> {
        let refreshToken = req?.cookies.refreshToken
        if (!refreshToken) {
            throw new UnauthorizedException(`Please sign in first`)
        }
        let data = Token.verifyRefresh(refreshToken) as User
        if (!data) {
            throw new UnauthorizedException(`Something went wrong, please sign in again`)
        }
        let user = await this.userRepo.findOne({
            where: { id: data?.id }
        })
        if (!user) {
            throw new NotFoundException(`Your data is not found, please register again`)
        }
        let payload = { id: user?.id, full_name: user?.full_name, role: user?.role }

        let aToken = Token.getAccessToken(payload)

        return {
            statusCode: 200,
            message: "success",
            data: {
                access_token: aToken
            }
        }
    }

    async forgotPassword(data: ForgotPasswordDto): Promise<ISuccess> {
        let { email } = data
        let user = await Conflicts.mustExist({ email }, this.userRepo, 'user') as User
        let otp = generateOtp()
        let key = `reset ${email}`
        setCache(key, otp)
        console.log(otp)
        let sms = await sendMail(user?.email, otp)

        return {
            statusCode: 200,
            message: "otp is sent to your email",
            data: {}
        }
    }

    async resetPassword(bodyData: ResetPasswordDto): Promise<ISuccess> {
        let { email, new_password, otp } = bodyData
        let user = await Conflicts.mustExist({ email }, this.userRepo, 'user')
        let data = await getCache(`reset ${email}`)
        console.log(data)
        if (!data || data !== otp) {
            throw new BadRequestException(`OTP expired or incorrect`)
        }
        delCache(`reset ${email}`)
        let hashed_password = await Crypto.hash(new_password)

        await this.userRepo.update({ email }, {
            password: hashed_password
        })

        return {
            statusCode: 200,
            message: "password is set, successfully",
            data: {}
        }
    }
}
