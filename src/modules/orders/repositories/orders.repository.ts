import { Injectable } from "@nestjs/common";
import { CreateOrderDto } from "../dtos/create-order";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { OrderStatus } from "../enums/order-status.enum";

@Injectable()
export class OrdersRepository {
    constructor (
        private readonly prismaService: PrismaService
    ) {}

    async getNextOrderNumber(restaurantId: string): Promise<number> {
        const lastOrder = await this.prismaService.order.findFirst({
            where: { restaurantId },
            orderBy: { orderNumber: 'desc' },
        })

        return lastOrder ? lastOrder.orderNumber + 1 : 1;
    }

    async create (userId: string, restaurantId: string, data: CreateOrderDto){
        const restaurantExists = await this.prismaService.restaurant.findUnique({
            where: {
                id: restaurantId,
            }
        })

        if(!restaurantExists) {
            throw new Error('Restaurante não encontrado.')
        }
        
        const nextOrderNumber = await this.getNextOrderNumber(restaurantId)
       
        return this.prismaService.order.create({
            data: {
                orderNumber: nextOrderNumber,
                userId,
                restaurantId,
                total: data.total,
                status: OrderStatus.PENDING, 
            },
        })
    }

    async findById(restaurantId: string) {
        return this.prismaService.order.findMany({
            where: { restaurantId },
            orderBy: { createdAt: "desc" }
        })
    }
    
    async findByRestaurant (restaurantId: string) {
        return this.prismaService.order.findMany({
            where: { restaurantId },
            orderBy: {createdAt: 'desc'},
        })
    }

    async updated(orderId: string, status: OrderStatus) {
        return this.prismaService.order.update({
            where: { id: orderId },
            data: { status },
        })
    }
}