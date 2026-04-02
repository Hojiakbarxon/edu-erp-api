import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export let CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
        let request = ctx.switchToHttp().getRequest()
        return request['user']
    }
)