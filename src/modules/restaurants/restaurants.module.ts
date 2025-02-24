import { Module } from "@nestjs/common";
import { RestaurantsController } from "./controllers/restaurant.controller";
import { RestaurantService } from "./services/restaurant.service";
import { RestaurantRepository } from "./repositories/restaurant.respository";
import { PrismaService } from "src/shared/prisma/prisma.service";

@Module({
    controllers: [RestaurantsController],
    providers: [RestaurantService, RestaurantRepository, PrismaService],
    exports: [RestaurantService]
})
export class RestaurantsModule {}