import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthDto } from "../dtos/auth.dto";
import { UserService } from "src/modules/users/services/users.service";
import { JwtService } from "@nestjs/jwt";
import * as brcrypt from 'bcryptjs'
import { EnvService } from "src/shared/env/env.service";
import { PrismaService } from "src/shared/prisma/prisma.service";


@Injectable()
export class AuthService {
    constructor (
        private readonly usersService: UserService,
        private readonly jwtService: JwtService,
        private readonly envService: EnvService,
        private readonly prismaService: PrismaService,
    ) {}    

    async login(data: AuthDto) {
        const user = await this.usersService.findByEmail(data.email)

        if(!user || !(await brcrypt.compare(data.password, user.password))) {
            throw new UnauthorizedException('Credenciais inválidas')
        }
    
        const tokens = await this.generateTokens(user.id)

        await this.updateRefreshToken(user.id, tokens.refreshToken)

        return tokens
    }

    async generateTokens(userId: string) {
        const accessToken = this.jwtService.sign(
            { sub: userId },
            {
                secret: this.envService.get('JWT_SECRET') || 'secret,',
                expiresIn: '15m',
            }
        )
        
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

    async updateRefreshToken(userId: string, refreshToken: string) {
        await this.prismaService.user.update({
            where: {id: userId},
            data: {refreshToken}
        })
    }

    async refreshToken(userId: string, refreshToken: string) {
        const user = await this.prismaService.user.findUnique({ where: { id: userId } });

        if (!user || user.refreshToken !== refreshToken) {
            throw new UnauthorizedException('Token de refresh inválido ou expirado');
        }

        const tokens = await this.generateTokens(userId);

        await this.updateRefreshToken(userId, tokens.refreshToken);

        return tokens;
    }
}
