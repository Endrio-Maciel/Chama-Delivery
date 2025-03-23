import { ApiProperty } from "@nestjs/swagger";

export class CreateProductSchema {
  @ApiProperty({ description: 'Nome do produto' })
  name: string;

  @ApiProperty({ description: 'Descrição do produto', required: false })
  description?: string;

  @ApiProperty({ description: 'Preço do produto', example: 9.99 })
  price: number;

  @ApiProperty({ description: 'URL da imagem do produto', required: false })
  imageUrl?: string;
}