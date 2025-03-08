import { Module } from "@nestjs/common";
import { UserModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { EnvService } from "src/shared/env/env.service";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { JwtStrategy } from "./jwt.strategy";
import { RefreshStrategy } from "./refresh.strategy";
import { EnvModule } from "src/shared/env/env.module";

@Module({
    imports: [
        UserModule,
        EnvModule,
        JwtModule.registerAsync({
           inject: [EnvService],
           useFactory: (envService: EnvService) => {
            console.log("🔥 JWT_SECRET carregado:", envService.get('JWT_SECRET'));
            return {
              secret: envService.get('JWT_SECRET') || "my-secret-key",
              signOptions: { expiresIn: '50m' },
            };
          },
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        PrismaService,
        JwtStrategy,
        RefreshStrategy,
    ],
    exports: [AuthService, JwtModule]
})
export default class AuthoModule {}