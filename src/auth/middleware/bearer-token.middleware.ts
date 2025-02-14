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

            if (decodedPayload.type !== 'refresh' && decodedPayload.type !== 'access') {
                throw new UnauthorizedException('토큰 타입이 잘못됐습니다!');
            }

            const secretKey = decodedPayload.type === 'refresh' ? envVariablesKeys.REFRESH_TOKEN_SECRET : envVariablesKeys.ACCESS_TOKEN_SECRET

            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configservice.get<string>(secretKey),
            })

            // return payload;
            req.user = payload; // ?
            next();
        } catch (e) {
            throw new UnauthorizedException(e);
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