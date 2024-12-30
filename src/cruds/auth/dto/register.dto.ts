import { UserDto } from 'src/cruds/user/dto/user.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class RegisterDto extends UserDto {
  @ApiProperty()
  @IsString({ message: 'Uma string era esperada' })
  @IsNotEmpty({ message: 'Este item é obrigatório' })
  @Exclude({ toPlainOnly: true })
  password: string;
}
