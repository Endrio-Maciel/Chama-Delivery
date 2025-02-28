import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../shared/prisma/prisma.service";
import { CreateProductDto } from "../dtos/create-product.dto";
import { UpdateProductDto } from "../dtos/updated-product.dto";

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(restaurantId: string, data: CreateProductDto) {
    return this.prisma.product.create({
      data: { 
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl,
        restaurantId,
       },
    });
  }

  async findById(id: string) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async findAllByRestaurant(restaurantId: string) {
    return this.prisma.product.findMany({ where: { restaurantId } });
  }

  async update(id: string, data: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}
