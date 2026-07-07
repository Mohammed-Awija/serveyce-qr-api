import { Module } from '@nestjs/common';
import { OfferingTypesService } from './offering-types.service';
import { OfferingTypesController } from './offering-types.controller';

@Module({
  providers: [OfferingTypesService],
  controllers: [OfferingTypesController]
})
export class OfferingTypesModule {}
