import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt.guard";
import { OrderService } from "../services/orders.service";
import { CreateOrderDto } from "../dtos/create-order";
import { UpdateOrderStatusDto } from "../dtos/updated-order";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post(":restaurantId")
  async create(@Request() req, @Param("restaurantId") restaurantId: string, @Body() body: CreateOrderDto) {
    return this.ordersService.create(req.user.userId, restaurantId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":orderId")
  async findAll(@Param("orderId") orderId: string) {
    return this.ordersService.findById(orderId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("restaurant/:restaurantId")
  async findById(@Param("restaurantId") orderId: string) {
    return this.ordersService.findById(orderId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":orderId/status")
  async updatedStatus (@Param("orderId") orderId: string, @Body() body: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(orderId, body.status)  
  }
}
