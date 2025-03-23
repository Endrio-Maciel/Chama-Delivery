import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common"
import { AuthService } from "../services/auth.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthDto } from "../dtos/auth.dto";

@ApiTags("Auth")
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('login')
    @ApiOperation({ summary: "Realiza o login e retorna um token JWT"})
    @ApiResponse({ status: 201, description: 'Login bem-sucedido.' })
    @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
    async login(@Body() body: AuthDto) {
        return this.authService.login(body)
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Gera um novo token de acesso usando o refresh token' })
    @ApiResponse({ status: 201, description: 'Token renovado com sucesso.' })
    @ApiResponse({ status: 401, description: 'Token de refresh inválido ou expirado.' })
    async refresh(@Body() body: { userId: string, refreshToken: string}) {
        return this.authService.refreshToken(body.userId, body.refreshToken)
    }
}