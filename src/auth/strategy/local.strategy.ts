import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local';
import { AuthService } from "../auth.service";
import { Injectable } from "@nestjs/common";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService : AuthService,
    ) {
        super();
    }

    // LocalStrategy
    // validate : username, password
    // return -> Request();
    async validate(email: string, password: string) {
        const user = await this.authService.authenticate(email, password);
        return user;
    }
}