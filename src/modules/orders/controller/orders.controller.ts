import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt.guard";
import { OrderService } from "../services/orders.service";
import { CreateOrderDto } from "../dtos/create-order";
import { UpdateOrderStatusDto } from "../dtos/updated-order";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/modules/auth/guards/roles.decorator";

@Controller("orders")
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrderService) {}

  @Post(":restaurantId")
  @Roles('client')
  async create(@Request() req, @Param("restaurantId") restaurantId: string, @Body() body: CreateOrderDto) {
    return this.ordersService.create(req.user.userId, restaurantId, body);
  }

  @Get(":orderId")
  @Roles("client", "restaurant", "admin")
  async findById(@Param("orderId") orderId: string) {
    return this.ordersService.findById(orderId);
  }

  @Get("restaurant/:restaurantId")
  @Roles("restaurant", "admin")
  async findByRestaurant(@Param("restaurantId") restaurantId: string) {
    return this.ordersService.findByRestaurant(restaurantId);
  }

  @Patch(":orderId/status")
  @Roles("restaurant")
  async updatedStatus (@Param("orderId") orderId: string, @Body() body: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(orderId, body.status)  
  }
}
