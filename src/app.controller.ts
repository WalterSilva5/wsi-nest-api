import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsPublic } from './cruds/auth/decorators/is-public.decorator';

@Controller('')
@ApiTags('app')
export class AppController {
  @Get(['', 'health', 'ping'])
  @IsPublic()
  @ApiResponse({ status: 200, description: 'pong' })
  async getPong(): Promise<{ message: string }> {
    return { message: 'pong' };
  }
}
