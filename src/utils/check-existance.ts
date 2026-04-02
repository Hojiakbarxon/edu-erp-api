import { ConflictException, NotFoundException, UnauthorizedException } from "@nestjs/common"

export class Conflicts {
    static async mustExist(field: object, repo: any, entity: string, options?: object) {
        let exist = await repo.findOne({
            where: field,
            select: options
        })
        if (!exist) {
            throw new NotFoundException(`The ${entity} is not found`)
        }
        return exist
    }

    static async mustBeUnique(field: object, repo: any, entity: string, field_name: string) {
        let exist = await repo.findOne({
            where: field
        })
        if (exist) {
            throw new ConflictException(`The ${entity} with this ${field_name} already exists`)
        }
    }
    static async mustBeUniqueOnUpdate(id: number, field: object, repo: any, entity: string, field_name: string) {
        let exists = await repo.findOne({
            where: field
        })
        if (exists && exists.id !== id) {
            throw new ConflictException(`The ${entity} with this ${field_name} already exists`)
        }
    }

    static async checkField(field: object, repo: any) {
        let exist = await repo.findOne({
            where: field,
        })
        if (!exist) {
            throw new UnauthorizedException(`The password or email is wrong`)
        }
        return exist
    }
}