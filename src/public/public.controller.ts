import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PublicService } from './public.service';
import { CreatePublicRequestDto } from './dto/create-request.dto';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  // Guest context: org + location (services now come from the tree)
  @Get('o/:slug/l/:locationId')
  getGuestContext(
    @Param('slug') slug: string,
    @Param('locationId') locationId: string,
  ) {
    return this.publicService.getGuestContext(slug, locationId);
  }

  // Menu children at a given level (parentId omitted = top level)
  @Get('o/:slug/l/:locationId/menu')
  getMenu(
    @Param('slug') slug: string,
    @Param('locationId') locationId: string,
    @Query('parentId') parentId?: string,
  ) {
    return this.publicService.getMenuChildren(
      slug,
      locationId,
      parentId ?? null,
    );
  }

  // An item's modifier groups
  @Get('o/:slug/items/:itemId/modifiers')
  getItemModifiers(
    @Param('slug') slug: string,
    @Param('itemId') itemId: string,
  ) {
    return this.publicService.getItemModifiers(slug, itemId);
  }

  @Post('o/:slug/l/:locationId/requests')
  createRequest(
    @Param('slug') slug: string,
    @Param('locationId') locationId: string,
    @Body() dto: CreatePublicRequestDto,
  ) {
    return this.publicService.createRequest(slug, locationId, {
      offeringNodeId: dto.offeringNodeId,
      selections: dto.selections,
      guestName: dto.guestName,
      notes: dto.notes,
    });
  }
}
