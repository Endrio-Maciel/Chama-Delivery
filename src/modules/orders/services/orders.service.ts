import { Injectable, NotFoundException } from "@nestjs/common";
import { OrdersRepository } from "../repositories/orders.repository";
import { CreateOrderDto } from "../dtos/create-order";
import { OrderStatus } from "../enums/order-status.enum";

@Injectable()
export class OrderService {
    constructor(
     private readonly ordersRepository: OrdersRepository
    ) {}

    async create(userId: string, restaurantId: string, data: CreateOrderDto) {
        return this.ordersRepository.create(userId, restaurantId, data)
    }

    async findById(orderId: string) {
        return this.ordersRepository.findById(orderId);
    }

    async findByRestaurant(restaurantId: string) {
        return this.ordersRepository.findByRestaurant(restaurantId);
    }

    async updateStatus(id: string, data: OrderStatus) {
    const order = await this.ordersRepository.updated(id, data);
    if (!order) throw new NotFoundException('pedido não encontrado');
    return order;
    }
}