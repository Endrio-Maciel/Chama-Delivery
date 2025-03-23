import { Injectable } from "@nestjs/common";
import { CreateOrderSchema } from "../dtos/create-order";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { OrderStatus } from "../enums/order-status.enum";
import { Prisma } from "@prisma/client";

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

    async create (userId: string, restaurantId: string, data: CreateOrderSchema){
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

    async getOrdersReport (restaurantId: string, startDate?: Date, endDate?: Date) {
        const filters: Prisma.OrderWhereInput = {
            restaurantId,
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
        }
    
        const orders = await this.prismaService.order.findMany({
            where: filters,
            include: {
                items: true,
            }
        })

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
        const completedOrders = orders.filter(order => order.status === 'COMPLETED').length;
        const canceledOrders = orders.filter(order => order.status === 'CANCELED').length;
        const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        return {
        totalOrders,
        totalRevenue,
        completedOrders,
        canceledOrders,
        averageTicket,
        orders, 
        };
    }
}