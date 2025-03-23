import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, isEmail, IsNotEmpty, IsString } from 'class-validator'

export class AuthDto {

    @ApiProperty({ description: 'Email do usuário', example: "john@email.com" })
    @IsString()
    @IsNotEmpty()
    @IsEmail({}, {message: "Credenciais inválidas."})
    email: string

    @IsString()
    @ApiProperty({ description: 'Senha do usuário', example: "senha123"})
    password: string
}