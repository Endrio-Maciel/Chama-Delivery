import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../enums/order-status.enum';

export class UpdateOrderStatusSchema {
  @ApiProperty({ description: 'Novo status do pedido', enum: OrderStatus })
  status: OrderStatus;
}