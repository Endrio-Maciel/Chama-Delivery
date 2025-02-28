import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt.guard";
import { CreateProductDto, createProductSchema } from "../dtos/create-product.dto";
import { ProductsService } from "../service/products.service";
import { UpdateProductDto, updateProductSchema } from "../dtos/updated-product.dto";

@Controller("restaurants/:restaurantId/products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Param("restaurantId") restaurantId: string, @Body() body: any) {
    const data: CreateProductDto = createProductSchema.parse(body);
    return this.productsService.create(restaurantId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Param("restaurantId") restaurantId: string) {
    return this.productsService.findAllByRestaurant(restaurantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.productsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async update(@Param("id") id: string, @Body() body: any) {
    const data: UpdateProductDto = updateProductSchema.parse(body);
    return this.productsService.update(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.productsService.delete(id);
  }
}
