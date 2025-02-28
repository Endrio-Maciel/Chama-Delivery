import { Module } from "@nestjs/common";
import { ProductsController } from "./controller/products.controller";
import { ProductsService } from "./service/products.service";
import { ProductsRepository } from "./repositories/products.repository";
import { PrismaService } from "src/shared/prisma/prisma.service";

@Module({
    controllers: [ProductsController],
    providers: [ProductsService, ProductsRepository, PrismaService]
})
export class ProductsModule{}