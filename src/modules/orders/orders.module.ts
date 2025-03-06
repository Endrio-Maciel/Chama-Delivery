import { Module } from "@nestjs/common";
import { OrdersController } from "./controller/orders.controller";
import { OrderService } from "./services/orders.service";
import { OrdersRepository } from "./repositories/orders.repository";
import { PrismaService } from "src/shared/prisma/prisma.service";

@Module({
    controllers: [OrdersController],
    providers: [OrderService, OrdersRepository, PrismaService]
})
export class OrdersModule {}