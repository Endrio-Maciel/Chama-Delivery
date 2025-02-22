import { Module } from "@nestjs/common";
import { UsersController } from "./controllers/users.controller";
import { UserService } from "./services/users.service";
import { UsersRepository } from "./repositories/users.repository";
import { PrismaService } from "src/shared/prisma/prisma.service";

@Module({
    controllers: [UsersController],
    providers: [UserService, UsersRepository, PrismaService],
    exports: [UserService],
})
export class UserModule {}