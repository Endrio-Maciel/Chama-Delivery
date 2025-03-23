import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { RestaurantService } from "../services/restaurant.service";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt.guard";
import { CreateRestaurantDto } from "../dtos/create-restaurant.dto";
import { UpdateRestaurantDto } from "../dtos/updated-restaurant.dto";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/modules/auth/guards/roles.decorator";

@ApiTags("Restaurants")
@ApiBearerAuth()
@Controller('restaurants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RestaurantsController {
    constructor (
        private readonly restaurantService: RestaurantService
    ) {}

    @Post()
    @Roles('restaurant', 'admin')
    @ApiOperation({ summary: 'Cria um novo restaurante' })
    @ApiResponse({ status: 201, description: 'Restaurante criado com sucesso.' })
    async create(@Request() req, @Body() body: CreateRestaurantDto) {
        return this.restaurantService.create(req.user.userId, body)
    }

    @Get()
    @Roles('restaurant', 'admin')
    @ApiOperation({ summary: 'Busca todos os restaurantes do usuário autenticado' })
    @ApiResponse({ status: 200, description: 'Lista de restaurantes retornada com sucesso.' })
    async findByOwner(@Request() req) {
        return this.restaurantService.findByOwner(req.user.userId)
    }

    @Patch(':id')
    @Roles('restaurant', 'admin')
    @ApiOperation({ summary: 'Atualiza um restaurante existente' })
    @ApiResponse({ status: 200, description: 'Restaurante atualizado com sucesso.' })
    async update(@Param('id') id: string, @Body() body: UpdateRestaurantDto) {
        return this.restaurantService.update(id, body)
    }

    @Delete(':id')
    @Roles('restaurant', 'admin')
    @ApiOperation({ summary: 'Deleta um restaurante' })
    @ApiResponse({ status: 204, description: 'Restaurante deletado com sucesso.' })
    async delete(@Param('id') id: string) {
        return this.restaurantService.delete(id)
    }
}