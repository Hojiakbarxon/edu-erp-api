import { SetMetadata } from "@nestjs/common"
import { UserRoles } from "src/enums"

export let ROLES_KEY = 'roles'
export let Roles = (...roles: (UserRoles | 'SELF')[]) => SetMetadata(ROLES_KEY, roles)