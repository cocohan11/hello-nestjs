import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { envVariablesKeys } from 'src/common/const/env.const';


@Injectable()
export class AuthService {

    constructor (
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configservice: ConfigService,
        private readonly jwtService: JwtService,
    ){}
    
    parseBasicToken(rawToken: string) {
        // 1) 토큰을 ' ' 기준으로 스플릿 한 후 토큰 값만 추출하기
        const basicSplit = rawToken.split(' ');

        if (basicSplit.length !== 2) {
            throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
        }

        const [basic, token] = basicSplit;

        if (basic.toLowerCase() != 'basic') {
            throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
        }

        // 2) 추출한 토큰을 base64 디코딩해서 이메일과 비밀번호로 나눈다. 
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        
        // "email:password"
        const tokenSplit = decoded.split(":");

        if (basicSplit.length !== 2) {
            throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
        }

        const [email, password] = tokenSplit;

        return {
            email,
            password,
        }
    }


    async parseBearerToken(rawToken: string, isRefreshToken: boolean) {
        const basicSplit = rawToken.split(' ');

        if (basicSplit.length !== 2) {
            throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
        }

        const [bearer, token] = basicSplit;

        if (bearer.toLowerCase() !== 'bearer') {
            throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configservice.get<string>(
                    isRefreshToken ? envVariablesKeys.REFRESH_TOKEN_SECRET : envVariablesKeys.ACCESS_TOKEN_SECRET
                ),
            })
            if (payload.type !== 'refresh') {
                throw new BadRequestException('RefreshToken을 보내주세요!');
            }
            return payload;
        } catch (e) {
            throw new UnauthorizedException('토큰이 만료됐습니다!' + e);
        }

    }


    // rawToken -> "Basic $token"
    async register(rawToken: string) {
        const { email, password } = this.parseBasicToken(rawToken);
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
        });

        if (user) {
            throw new BadRequestException('이미 가입한 이메일 입니다!');
        }

        const hash = await bcrypt.hash(password, this.configservice.get<number>(envVariablesKeys.HASH_ROUNDS));


        await this.userRepository.save({
            email,
            password: hash,
        })

        return this.userRepository.findOne({
            where: {
                email,
            }
        })
    }


    async authenticate(email: string, password: string) {
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
        });

        if (!user) {
            throw new BadRequestException('잘못된 로그인 정보입니다!');
        }

        const passOk = await bcrypt.compare(password, user.password); // 비교
        if (!passOk) {
            throw new BadRequestException('잘못된 로그인 정보입니다!');
        }

        return user;
    }


    async issueToken(user: {id: number, role: Role}, isRefreshToken: boolean) {
        const refreshTokenSecret = this.configservice.get<string>(envVariablesKeys.REFRESH_TOKEN_SECRET);
        const accessTokenSecret = this.configservice.get<string>(envVariablesKeys.ACCESS_TOKEN_SECRET);

        return await this.jwtService.signAsync({
            sub: user.id,
            role: user.role,
            type: isRefreshToken ? 'refresh' : 'access',
        }, {
            secret: isRefreshToken ? refreshTokenSecret : accessTokenSecret,
            expiresIn: isRefreshToken ? '24h' : 300
        })
    }

    async logoin(rawToken: string) {
        const { email, password } = this.parseBasicToken(rawToken);
        const user = await this.authenticate(email, password);


        return {
            refreshToken: await this.issueToken(user, true),
            accessToken: await this.issueToken(user, false),
        }
    }

}
