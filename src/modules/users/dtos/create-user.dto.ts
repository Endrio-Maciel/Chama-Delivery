import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { UserRole } from '../enums/user-role';

export class CreateUserDto {
  @ApiProperty({ description: 'Nome do usuário', example: 'Endrio' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'E-mail do usuário', example: 'endrio@email.com' })
  @IsEmail({}, { message: 'O e-mail fornecido não é válido.' })
  email: string;

  @ApiProperty({ description: 'Número de telefone', example: '(11) 98765-4321' })
  @IsString()
  @Matches(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, { message: 'O número de telefone fornecido não é válido.' })
  phone: string;

  @ApiProperty({ description: 'Senha do usuário', example: 'senha123' })
  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  password: string;

  @ApiProperty({ description: 'Função do usuário', enum: UserRole, default: UserRole.CLIENT })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.CLIENT;
}
