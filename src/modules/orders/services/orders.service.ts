import { Injectable, NotFoundException } from "@nestjs/common";
import { OrdersRepository } from "../repositories/orders.repository";
import { CreateOrderDto } from "../dtos/create-order";
import { OrderStatus } from "../enums/order-status.enum";
import { OrdersGateway } from "../gateways/orders.gateway";
import { FilterOrderSchema } from "../dtos/filter-date-order";

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

    async getOrdersReport(restaurantId: string, filter: FilterOrderSchema) {
        const startDate = filter.startDate ? new Date(filter.startDate) : undefined
        const endDate = filter.endDate ? new Date(filter.endDate) : undefined

        const result = await this.ordersRepository.getOrdersReport(
            restaurantId, 
            startDate,
            endDate
        )

        if(!result) {
            return { message: "Restaurante não encontrado ou sem pedidos registrados."}
        }

        return result.orders
    }
}