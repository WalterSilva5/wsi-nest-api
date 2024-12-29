import { ApiResponseProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class User {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  firstName: string;

  @ApiResponseProperty()
  lastName: string;

  @ApiResponseProperty()
  email: string;

  @ApiResponseProperty()
  role: string;

  @Exclude()
  sessionToken?: string;

  @Exclude()
  password?: string;

  @ApiResponseProperty()
  createdAt?: Date;

  @ApiResponseProperty()
  updatedAt?: Date;

  @ApiResponseProperty()
  deletedAt?: Date;
}
