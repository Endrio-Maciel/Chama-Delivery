import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt.guard";
import { CreateProductDto, createProductSchema } from "../dtos/create-product.dto";
import { ProductsService } from "../service/products.service";
import { UpdateProductDto, updateProductSchema } from "../dtos/updated-product.dto";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Products")
@ApiBearerAuth()
@Controller("restaurants/:restaurantId/products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Cria um novo produto para um restaurante' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso.' })
  async create(@Request() req, @Param("restaurantId") restaurantId: string, @Body() body: any) {
    const data: CreateProductDto = createProductSchema.parse(body);
    return this.productsService.create(restaurantId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os produtos de um restaurante' })
  @ApiResponse({ status: 200, description: 'Lista de produtos retornada com sucesso.' })
  @UseGuards(JwtAuthGuard)
  async findAll(@Param("restaurantId") restaurantId: string) {
    return this.productsService.findAllByRestaurant(restaurantId);
  }

  @Get(":id")
  @ApiOperation({ summary: 'Busca um produto por ID' })
  @ApiResponse({ status: 200, description: 'Produto encontrado com sucesso.' })
  @UseGuards(JwtAuthGuard)
  async findById(@Param("id") id: string) {
    return this.productsService.findById(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: 'Atualiza um produto existente' })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso.' })
  @UseGuards(JwtAuthGuard)
  async update(@Param("id") id: string, @Body() body: any) {
    const data: UpdateProductDto = updateProductSchema.parse(body);
    return this.productsService.update(id, data);
  }

  @Delete(":id")
  @ApiOperation({ summary: 'Deleta um produto' })
  @ApiResponse({ status: 204, description: 'Produto deletado com sucesso.' })
  @UseGuards(JwtAuthGuard)
  async delete(@Param("id") id: string) {
    return this.productsService.delete(id);
  }
}
