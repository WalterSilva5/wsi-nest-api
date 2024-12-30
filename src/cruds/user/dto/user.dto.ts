import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @ApiResponseProperty()
  id?: number;

  @ApiProperty()
  @IsString({ message: 'Uma string era esperada' })
  @IsNotEmpty({ message: 'Este item é obrigatório' })
  firstName: string;

  @ApiProperty()
  @IsString({ message: 'Uma string era esperada' })
  @IsNotEmpty({ message: 'Este item é obrigatório' })
  lastName: string;

  @ApiProperty()
  @IsString({ message: 'Uma string era esperada' })
  @IsNotEmpty({ message: 'Este item é obrigatório' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty()
  @IsEnum(Role, { message: 'Valor inválido' })
  role?: Role;

  @ApiResponseProperty()
  createdAt?: string;

  @ApiResponseProperty()
  updatedAt?: string;

  @ApiResponseProperty()
  deletedAt?: string;
}
