import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthDto } from "../dtos/auth.dto";
import { UserService } from "src/modules/users/services/users.service";
import { JwtService } from "@nestjs/jwt";
import * as brcrypt from 'bcryptjs'
import { EnvService } from "src/shared/env/env.service";


@Injectable()
export class AuthService {
    constructor (
        private readonly usersService: UserService,
        private readonly jwtService: JwtService,
        private readonly envService: EnvService,
    ) {}    

    async login(data: AuthDto) {
        const user = await this.usersService.findByEmail(data.email)
        if(!user || !(await brcrypt.compare(data.password, user.password))) {
            throw new UnauthorizedException('Credenciais inválidas')
        }
    
        return this.generateTokens(user.id)
    }

    async generateTokens(userId: string) {
        const accessToken = this.jwtService.sign({ sub: userId }, {
            expiresIn: "7d", // alterar aqui depois
        })
        const refreshToken = this.jwtService.sign(
            { 
                sub: userId
            },
            { 
                secret: this.envService.get('JWT_REFRESH_SECRET') || 'refresh_secret', 
                expiresIn: '7d',
            },
        )

        return { accessToken, refreshToken }
    }
}
