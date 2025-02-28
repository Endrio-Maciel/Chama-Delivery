import { Injectable, NotFoundException } from "@nestjs/common";
import { ProductsRepository } from "../repositories/products.repository";
import { CreateProductDto } from "../dtos/create-product.dto";
import { UpdateProductDto } from "../dtos/updated-product.dto";

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async create(restaurantId: string, data: CreateProductDto) {
    return this.productsRepository.create(restaurantId, data);
  }

  async findById(id: string) {
    const product = await this.productsRepository.findById(id);
    if (!product) throw new NotFoundException("Produto não encontrado.");
    return product;
  }

  async findAllByRestaurant(restaurantId: string) {
    return this.productsRepository.findAllByRestaurant(restaurantId);
  }

  async update(id: string, data: UpdateProductDto) {
    const product = await this.productsRepository.update(id, data);
    if (!product) throw new NotFoundException("Produto não encontrado.");
    return product;
  }

  async delete(id: string) {
    await this.productsRepository.delete(id);
  }
}
