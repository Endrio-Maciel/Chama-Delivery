import { Injectable, NotFoundException } from "@nestjs/common";
import { OrdersRepository } from "../repositories/orders.repository";
import { CreateOrderDto } from "../dtos/create-order";
import { OrderStatus } from "../enums/order-status.enum";
import { OrdersGateway } from "../gateways/orders.gateway";

@Injectable()
export class OrderService {
    constructor(
     private readonly ordersRepository: OrdersRepository,
     private readonly ordersGateway: OrdersGateway
    ) {}

    async create(userId: string, restaurantId: string, data: CreateOrderDto) {
        const order = await this.ordersRepository.create(userId, restaurantId, data)
        
        console.log("Novo pedido criado:", order)

        setTimeout(()=>{
            this.ordersGateway.sendNewOrderNotification(restaurantId, order)
        }, 100)
    
        return order
    }

    async findById(orderId: string) {
        return this.ordersRepository.findById(orderId);
    }

    async findByRestaurant(restaurantId: string) {
        return this.ordersRepository.findByRestaurant(restaurantId);
    }

    async updateStatus(orderId: string, status: OrderStatus) {
    const order = await this.ordersRepository.updated(orderId, status);
    if (!order) throw new NotFoundException('pedido não encontrado');
    
    this.ordersGateway.sendOrderStatusUpdate(orderId, status)
    
    return order;
    }
}