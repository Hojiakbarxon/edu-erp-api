import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import Token from "src/utils/Token";

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        let req = context.switchToHttp().getRequest()

        let auth = req.headers?.authorization
        if (!auth) {
            throw new UnauthorizedException(`User did not sign in`)
        }
        let bearer = auth.split(" ")[0]
        let token = auth.split(" ")[1]

        if (bearer !== 'Bearer' || !token) {
            throw new UnauthorizedException(`User did not sign in`)
        }
        let data: unknown
        try {
            data = Token.verifyAccess(token)
        } catch (error) {
            throw new UnauthorizedException(`Token is invalid, or expired`)
        }

        if (!data) {
            throw new UnauthorizedException(`User did not sign in`)
        }

        req['user'] = data
        return true
    }
}