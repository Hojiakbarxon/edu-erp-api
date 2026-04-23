import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { Observable } from "rxjs";
import { ROLES_KEY } from "src/decorators/roles.decorator";
import { UserRoles } from "src/enums";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class RoleGurd implements CanActivate {
    constructor(private reflector: Reflector, @InjectRepository(User) private readonly userRepo: Repository<User>) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        let roles = this.reflector.getAllAndOverride<(UserRoles | "SELF")[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()]
        )

        if (!roles || roles.length == 0) return true

        let req = context.switchToHttp().getRequest()
        let user = req['user']

        if (roles.includes(user?.role)) {
            let processingUser = await this.userRepo.findOne({
                where: { id: req.params?.id }
            }) as User

            if (processingUser) {
                if (user?.role === UserRoles.ADMIN && processingUser.role === UserRoles.SUPERADMIN) {
                    throw new ForbiddenException(`You can not modify the SuperAdmin`)
                }
            }

            return true
            
        }

        if (roles?.includes('SELF')) {
            if (user?.id === +req.params.id) return true
        }

        throw new ForbiddenException(`Forbidden user`)
    }

}