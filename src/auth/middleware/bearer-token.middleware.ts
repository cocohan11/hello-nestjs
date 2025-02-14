import { BadRequestException, Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { envVariablesKeys } from "src/common/const/env.const";


@Injectable()
export class BearerTokenMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configservice: ConfigService,
    ) {}

    async use(req: any, res: any, next: (error?: Error | any) => void) {
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            next(); // -> 미들웨어 끝내고 다음으로 가라
            return;
        }
        
        try {
            const token = this.validateBearerToken(authHeader);
            const decodedPayload = this.jwtService.decode(token);

            if (!decodedPayload) { // 개인적으로 추가함
                throw new UnauthorizedException('토큰 디코드에 실패했습니다다!');
            }

            if (decodedPayload.type !== 'refresh' && decodedPayload.type !== 'access') {
                throw new UnauthorizedException('토큰 타입이 잘못됐습니다!');
            }

            const secretKey = decodedPayload.type === 'refresh' ? envVariablesKeys.REFRESH_TOKEN_SECRET : envVariablesKeys.ACCESS_TOKEN_SECRET

            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configservice.get<string>(secretKey),
            })

            // return payload;
            req.user = payload; 
            next();
        } catch (e) {
            next(); 
            // 어차피 토큰에 문제있으면 미들웨어 다음 Guard에서 return false로 걸러지니까, 
            // 토큰 잘 못 입력되도 통과될 수 있게 미들웨어에서 next()로 넘기기. 
            // 그러면 @Public이 달린 라우터는 토큰상관없이 다 통과됨 
        }
    }


    validateBearerToken(rawToken: string) {
        const basicSplit = rawToken.split(' ');

        if (basicSplit.length !== 2) {
            throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
        }

        const [bearer, token] = basicSplit;

        if (bearer.toLowerCase() !== 'bearer') {
            throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
        }

        return token;
    }
}