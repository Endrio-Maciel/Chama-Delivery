import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { RestaurantService } from "../services/restaurant.service";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt.guard";
import { CreateRestaurantDto, createRestaurantSchema } from "../dtos/create-restaurant.dto";
import { updatedRestaurantSchema } from "../dtos/updated-restaurant.dto";

@Controller('restaurants')
export class RestaurantsController {
    constructor (
        private readonly restaurantService: RestaurantService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Request() req, @Body() body: any) {
        console.log('Usuario autenticado no restaurantController:', req.user)
        const data: CreateRestaurantDto = createRestaurantSchema.parse(body)
        return this.restaurantService.create(req.user.userId, data)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findByOwner(@Request() req) {
        return this.restaurantService.findByOwner(req.user.userId)
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(@Param('id') id: string, @Body() body: any) {
        const data: CreateRestaurantDto = updatedRestaurantSchema.parse(body)
        return this.restaurantService.update(id, data)
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.restaurantService.delete(id)
    }
}