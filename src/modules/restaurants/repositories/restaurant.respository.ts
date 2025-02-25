import { PrismaService } from "src/shared/prisma/prisma.service";
import { CreateRestaurantDto } from "../dtos/create-restaurant.dto";
import { UpdatedRestaurantSchema } from "../dtos/updated-restaurant.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RestaurantRepository {
    constructor (
        private readonly prismaService: PrismaService
    ) {}

    async create (ownerId: string, data: CreateRestaurantDto){
        return this.prismaService.restaurant.create({
            data: {
                ownerId,
                name: data.name,
                restaurantPhone: data.restaurantPhone,
                description: data.description,
                address: data.address,
            },
        })
    }

    async findById(id: string) {
        return this.prismaService.restaurant.findUnique({where: { id }})
    }

    async findByOwner(ownerId: string) {
        return this.prismaService.restaurant.findMany({ where: { ownerId }})
    }

    async update(id: string, data: UpdatedRestaurantSchema) {
        return this.prismaService.restaurant.update({where: {id}, data,})
    }

    async delete (id: string) {
        return this.prismaService.restaurant.delete({ where: { id }})
    }
    
}