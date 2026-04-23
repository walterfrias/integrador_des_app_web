import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';

@Module({
  controllers: [AuthController],
  providers: [],
  imports: [],
  exports: [],
})
export class AuthModule {}
