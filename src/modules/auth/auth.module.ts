import { Module } from "@nestjs/common";
import { UserModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { EnvService } from "src/env/env.service";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { JwtStrategy } from "./jwt.strategy";
import { RefreshStrategy } from "./refresh.strategy";
import { EnvModule } from "src/env/env.module";

@Module({
    imports: [
        UserModule,
        EnvModule,
        JwtModule.registerAsync({
           inject: [EnvService],
           useFactory: (envService: EnvService) => ({
            secret: envService.get('JWT_SECRET'),
            signOptions: { expiresIn: '15m' },
           }),
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        PrismaService,
        JwtStrategy,
        RefreshStrategy,
    ],
    exports: [AuthService]
})
export default class AuthoModule {}