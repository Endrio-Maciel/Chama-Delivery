import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdatedUserSchema } from "../dtos/updated-user.dto";
import { PrismaService } from "../../../shared/prisma/prisma.service";

@Injectable()
export class UsersRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateUserDto) {
       return this.prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: data.password,
            role: data.role,
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
            data: {
                ...data,
                updatedAt: new Date()
            },
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