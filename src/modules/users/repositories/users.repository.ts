import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { CreateUserSchema } from "../dtos/create-user.dto";
import { UpdatedUserSchema } from "../dtos/updated-user.dto";

@Injectable()
export class UsersRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateUserSchema) {
       return this.prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: data.password,
        }
       })
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: {
                email,
            }
        })
    }

    async updated (id: string, data: UpdatedUserSchema) {
        return this.prisma.user.update({
            where: { id },
            data,
        })
    }

    async delete (id: string) {
        return this.prisma.user.delete({
            where: {
                id,
            }
        })
    }
}