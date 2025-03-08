import { Module } from "@nestjs/common";
import { OrdersController } from "./controller/orders.controller";
import { OrderService } from "./services/orders.service";
import { OrdersRepository } from "./repositories/orders.repository";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { OrdersGateway } from "./gateways/orders.gateway";
import { JwtModule } from "@nestjs/jwt";
import { EnvModule } from "src/shared/env/env.module";
import AuthoModule from "../auth/auth.module";
import { EnvService } from "src/shared/env/env.service";

@Module({
    imports: [
        AuthoModule,
        EnvModule,
        JwtModule.registerAsync({
            imports: [EnvModule],
            inject: [EnvService],
            useFactory: (envService: EnvService) => ({
                secret: envService.get("JWT_SECRET"),
                signOptions: { expiresIn: '50m' }
            })
        })
    ],
    controllers: [OrdersController],
    providers: [OrderService, OrdersRepository, OrdersGateway, PrismaService],
    exports: [OrdersGateway],
})
export class OrdersModule {}