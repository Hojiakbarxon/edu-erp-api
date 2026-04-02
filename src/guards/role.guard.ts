import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "src/decorators/roles.decorator";
import { UserRoles } from "src/enums";

@Injectable()
export class RoleGurd implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        let roles = this.reflector.getAllAndOverride<(UserRoles | "SELF")[]>(
            ROLES_KEY,  
            [context.getHandler(), context.getClass()]
        )

        if (!roles || roles.length == 0) return true

        let req = context.switchToHttp().getRequest()
        let user = req['user']

        if (roles.includes(user?.role)) return true

        if (roles?.includes('SELF')) {
            if (user?.id === +req.params.id) return true
        }

        throw new ForbiddenException(`Forbidden user`)
    }

}