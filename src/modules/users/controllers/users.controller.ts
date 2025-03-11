import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { UserService } from "../services/users.service";
import { CreateUserSchema } from "../dtos/create-user.dto";
import { UpdatedUserSchema } from "../dtos/updated-user.dto";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt.guard";

@ApiTags("Users")
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UserService) {}

    @Post()
    @ApiOperation({ summary: 'Cria um novo usuário' })
     @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
    async create(@Body() data: CreateUserSchema) {
        return this.usersService.create(data)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get(':email')
    @ApiOperation({ summary: 'Buscar usuário por e-mail' })
    @ApiResponse({ status: 200, description: 'Usuário encontrado.' })
    async findByEmail(@Param('email') email: string) {
        return this.usersService.findByEmail(email)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Patch(':id')
    @ApiOperation({ summary: 'Atualiza um usuário existente' })
    @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.' })
    async updated(@Param('id') id: string, @Body() data: UpdatedUserSchema ) {
        return this.usersService.updated(id, data)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete(':id')
    @ApiOperation({ summary: 'Deleta um usuário' })
    @ApiResponse({ status: 204, description: 'Usuário deletado com sucesso.' })
    async delete(@Param('id') id: string) {
        return this.usersService.delete(id)
    }
}