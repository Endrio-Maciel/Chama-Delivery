import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({ description: 'Nome do restaurante', example: 'Hamburgueria do Endrio' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'ID do dono do restaurante', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsNotEmpty()
  ownerId: string;

  @ApiProperty({ description: 'Telefone do restaurante', example: '(11) 98765-4321' })
  @IsString()
  @Matches(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, { message: 'O número de telefone fornecido não é válido.' })
  restaurantPhone: string;

  @ApiProperty({ description: 'Descrição do restaurante', example: 'A melhor hamburgueria da cidade', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Endereço do restaurante', example: 'Rua dos Burgers, 123, Centro' })
  @IsString()
  @IsNotEmpty()
  address: string;
}
