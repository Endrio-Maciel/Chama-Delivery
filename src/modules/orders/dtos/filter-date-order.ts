import { ApiProperty } from "@nestjs/swagger";

export class FilterOrderSchema {
  @ApiProperty({ description: 'Data de início para o filtro', required: false })
  startDate?: string;

  @ApiProperty({ description: 'Data de término para o filtro', required: false })
  endDate?: string;
}