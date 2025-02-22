import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common"
import { AuthService } from "../services/auth.service";
import { authSchema } from "../dtos/auth.dto";
import { JwtAuthGuard } from "../guards/jwt.guard";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('login')
    async login(@Body() body: any) {
        const data = authSchema.parse(body)
        return this.authService.login(data)
    }

    @UseGuards(JwtAuthGuard)
    @Post('refresh')
    async refresh(@Request() req: any) {
        return this.authService.generateTokens(req.user.userId)
    }

}