import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Public } from "../decorator/public.decorator";


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
    ) {}
    canActivate(context: ExecutionContext): boolean {
        // 만약에 public decoration이 되어있으면
        // 모든 로직을 bypass
        const isPublic = this.reflector.get(Public, context.getHandler());
        console.log(isPublic);

        // @Public 데코레이터가 있으면 통과 / @Public()가 없으면 undefined가 뜸
        if (isPublic) { 
            return true;
        }

        // 요청에서 user 객체가 존재하는지 확인한다. (미들웨어 통과) 
        const request = context.switchToHttp().getRequest();

        if (!request.user || request.user.type !== 'access') { // 리소스접근은 access만
            return false; // 인증 실패시 403 Forbidden
        }

        return true;
    }

}