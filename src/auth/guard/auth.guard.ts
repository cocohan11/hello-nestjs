import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";


@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        // 요청에서 user 객체가 존재하는지 확인한다. (미들웨어 통과) 
        const request = context.switchToHttp().getRequest();

        if (!request.user || request.user.type !== 'access') { // 리소스접근은 access만
            return false;
        }

        return true;
    }

}