import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { UserService } from "../services/users.service";
import { CreateUserSchema } from "../dtos/create-user.dto";
import { UpdatedUserSchema } from "../dtos/updated-user.dto";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UserService) {}

    @Post()
    async create(@Body() data: CreateUserSchema) {
        return this.usersService.create(data)
    }

    @Get(':email')
    async findByEmail(@Param('email') email: string) {
        return this.usersService.findByEmail(email)
    }

    @Patch(':id')
    async updated(@Param('id') id: string, @Body() data: UpdatedUserSchema ) {
        return this.usersService.updated(id, data)
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.usersService.delete(id)
    }
}