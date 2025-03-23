import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderSchema {
    @ApiProperty({ description: 'Total do pedido', example: 99.99 })
    total: number;
  
    @ApiProperty({ description: 'Itens do pedido', type: () => [OrderItemSchema] })
    items: OrderItemSchema[];
  }
  
  export class OrderItemSchema {
    @ApiProperty({ description: 'ID do produto' })
    productId: string;
  
    @ApiProperty({ description: 'Quantidade do produto', example: 1 })
    quantity: number;
  
    @ApiProperty({ description: 'Preço do produto', example: 9.99 })
    price: number;
  }
  