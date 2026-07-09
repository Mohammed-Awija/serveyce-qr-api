import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TenantGuard } from '../auth/tenant.guard';
import { CurrentOrg } from '../auth/current-org.decorator';
import type { TenantContext } from '../auth/tenant.service';
import { ModifiersService } from './modifiers.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { CreateOptionDto } from './dto/create-option.dto';

@Controller('modifiers')
@UseGuards(TenantGuard)
export class ModifiersController {
  constructor(private readonly modifiers: ModifiersService) {}

  @Get('groups')
  findGroups(
    @CurrentOrg() org: TenantContext,
    @Query('itemId') itemId: string,
  ) {
    return this.modifiers.findGroupsForItem(org.organizationId, itemId);
  }

  @Post('groups')
  createGroup(@CurrentOrg() org: TenantContext, @Body() dto: CreateGroupDto) {
    return this.modifiers.createGroup(org.organizationId, dto);
  }

  @Delete('groups/:id')
  removeGroup(@CurrentOrg() org: TenantContext, @Param('id') id: string) {
    return this.modifiers.removeGroup(org.organizationId, id);
  }

  @Post('options')
  createOption(@CurrentOrg() org: TenantContext, @Body() dto: CreateOptionDto) {
    return this.modifiers.createOption(org.organizationId, dto);
  }

  @Delete('options/:id')
  removeOption(@CurrentOrg() org: TenantContext, @Param('id') id: string) {
    return this.modifiers.removeOption(org.organizationId, id);
  }
}
