import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TenantGuard } from '../auth/tenant.guard';
import { CurrentOrg } from '../auth/current-org.decorator';
import type { TenantContext } from '../auth/tenant.service';
import { OfferingTypesService } from './offering-types.service';
import { CreateOfferingTypeDto } from './dto/create-offering-type.dto';
import { UpdateOfferingTypeDto } from './dto/update-offering-type.dto';

@Controller('offering-types')
@UseGuards(TenantGuard)
export class OfferingTypesController {
  constructor(private readonly offeringTypes: OfferingTypesService) {}

  @Post()
  create(@CurrentOrg() org: TenantContext, @Body() dto: CreateOfferingTypeDto) {
    return this.offeringTypes.create(org.organizationId, dto);
  }

  @Get()
  findAll(@CurrentOrg() org: TenantContext) {
    return this.offeringTypes.findAll(org.organizationId);
  }

  @Patch(':id')
  update(
    @CurrentOrg() org: TenantContext,
    @Param('id') id: string,
    @Body() dto: UpdateOfferingTypeDto,
  ) {
    return this.offeringTypes.update(org.organizationId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentOrg() org: TenantContext, @Param('id') id: string) {
    return this.offeringTypes.remove(org.organizationId, id);
  }
}
