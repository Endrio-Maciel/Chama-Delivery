import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt.guard";
import { OrderService } from "../services/orders.service";
import { CreateOrderDto } from "../dtos/create-order";
import { UpdateOrderStatusDto } from "../dtos/updated-order";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/modules/auth/guards/roles.decorator";
import { filterOrderSchema } from "../dtos/filter-date-order";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Orders')
@ApiBearerAuth()
@Controller("orders")
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrderService) {}

  @Post(":restaurantId")
  @Roles('client')
  @ApiOperation({ summary: 'Criar novo pedido' })
  @ApiResponse({ status: 201, description: 'Pedido criado com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  async create(@Request() req, @Param("restaurantId") restaurantId: string, @Body() body: CreateOrderDto) {
    return this.ordersService.create(req.user.userId, restaurantId, body);
  }

  @Get(":orderId")
  @Roles("client", "restaurant", "admin")
  @ApiOperation({ summary: 'Buscar pedido por ID' })
  @ApiResponse({ status: 200, description: 'Pedido encontrado.' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado.' })
  async findById(@Param("orderId") orderId: string) {
    return this.ordersService.findById(orderId);
  }

  @Get("restaurant/:restaurantId")
  @Roles("restaurant", "admin")
  @ApiOperation({ summary: 'Listar pedidos de um restaurante' })
  @ApiResponse({ status: 200, description: 'Pedidos encontrados.' })
  async findByRestaurant(@Param("restaurantId") restaurantId: string) {
    return this.ordersService.findByRestaurant(restaurantId);
  }

  @Patch(":orderId/status")
  @Roles("restaurant")
  @ApiOperation({ summary: 'Atualizar status de um pedido' })
  @ApiResponse({ status: 200, description: 'Status do pedido atualizado.' })
  async updatedStatus (@Param("orderId") orderId: string, @Body() body: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(orderId, body.status)  
  }

  @Get("restaurant/:restaurantId/report")
  @Roles('restaurant', 'admin')
  @ApiOperation({ summary: 'Gerar relatório de pedidos de um restaurante' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Data inicial do filtro' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Data final do filtro' })
  @ApiResponse({ status: 200, description: 'Relatório gerado com sucesso.' })
  async getOrdersReport (
    @Param("restaurantId") restaurantId: string,
    @Query() query: any
  ) {
    const parsedQuery = filterOrderSchema.safeParse(query)
    
    if(!parsedQuery.success) {
      return { error: parsedQuery.error.errors }
    }

    return this.ordersService.getOrdersReport(restaurantId, parsedQuery.data)
  }
}
