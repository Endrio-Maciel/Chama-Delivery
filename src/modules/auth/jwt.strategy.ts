import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { EnvService } from "src/shared/env/env.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly envService: EnvService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: envService.get('JWT_SECRET'), 
        })
    }

    async validate(payload: { sub: string }) {
        console.log('Payload recebido no JwtStrategy', payload)
        return { userId: payload.sub }
    }
}       