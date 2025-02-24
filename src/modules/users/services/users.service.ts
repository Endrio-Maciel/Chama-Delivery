import { Injectable, NotFoundException } from "@nestjs/common";
import { UsersRepository } from "../repositories/users.repository";
import { CreateUserSchema } from "../dtos/create-user.dto";
import * as brcrypt from 'bcryptjs'
import { UpdatedUserSchema } from "../dtos/updated-user.dto";

@Injectable()
export class UserService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async create(data: CreateUserSchema) {
        const hashedPassword = await brcrypt.hash(data.password, 10)
        return this.usersRepository.create({ ...data, password: hashedPassword }) 
    }

    async findByEmail(email: string) {
       return this.usersRepository.findByEmail(email)
    }

    async updated(id: string, data: UpdatedUserSchema) {
        const user = await this.usersRepository.updated(id, data)
        if (!user) throw new NotFoundException("Usuario não encontrado.")
        
        return user
    }

    async delete(id: string) {
        await this.usersRepository.delete(id)
    }
}