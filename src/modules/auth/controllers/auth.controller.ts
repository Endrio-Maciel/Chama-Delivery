import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common"
import { AuthService } from "../services/auth.service";
import { JwtAuthGuard } from "../guards/jwt.guard";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

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
    async login(@Body() body: any) {
        return this.authService.login(body)
    }

    @UseGuards(JwtAuthGuard)
    @Post('refresh')
    @ApiOperation({ summary: 'Gera um novo token de acesso usando o refresh token' })
    @ApiResponse({ status: 201, description: 'Token renovado com sucesso.' })
    @ApiResponse({ status: 401, description: 'Token de refresh inválido ou expirado.' })
    async refresh(@Request() req: any) {
        return this.authService.generateTokens(req.user.userId)
    }
}