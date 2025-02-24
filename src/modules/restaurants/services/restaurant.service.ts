import { Injectable, NotFoundException } from "@nestjs/common";
import { RestaurantRepository } from "../repositories/restaurant.respository";
import { CreateRestaurantDto } from "../dtos/create-restaurant.dto";

@Injectable()
export class RestaurantService {
    constructor(
     private readonly restaurantsRepository: RestaurantRepository
    ) {}

    async create(ownerId: string, data: CreateRestaurantDto) {
        return this.restaurantsRepository.create(ownerId, data)
    }

    async findByOwner(ownerId: string) {
        return this.restaurantsRepository.findByOwner(ownerId);
    }

    async update(id: string, data: CreateRestaurantDto) {
    const restaurant = await this.restaurantsRepository.update(id, data);
    if (!restaurant) throw new NotFoundException('Restaurante não encontrado');
    return restaurant;
    }

    async delete(id: string) {
    return this.restaurantsRepository.delete(id);
    }
}