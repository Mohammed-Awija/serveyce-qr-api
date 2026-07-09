import { Module } from '@nestjs/common';
import { OfferingNodesService } from './offering-nodes.service';
import { OfferingNodesController } from './offering-nodes.controller';

@Module({
  providers: [OfferingNodesService],
  controllers: [OfferingNodesController],
})
export class OfferingNodesModule {}
