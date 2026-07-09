import { Module } from '@nestjs/common';
import { ModifiersService } from './modifiers.service';
import { ModifiersController } from './modifiers.controller';

@Module({
  providers: [ModifiersService],
  controllers: [ModifiersController],
})
export class ModifiersModule {}
