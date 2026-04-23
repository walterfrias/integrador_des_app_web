import {
  Body,
  Controller,
  Post,
  NotImplementedException,
} from '@nestjs/common';
import { LoginDto } from '../dtos/input/login.dto';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Post('')
  async login(@Body() dto: LoginDto): Promise<{ accessToken: string }> {
    console.log(dto);

    return await Promise.reject(new NotImplementedException());
  }
}
