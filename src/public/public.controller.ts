import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PublicService } from './public.service';
import { CreatePublicRequestDto } from './dto/create-request.dto';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('o/:slug/l/:locationId')
  getGuestContext(
    @Param('slug') slug: string,
    @Param('locationId') locationId: string,
  ) {
    return this.publicService.getGuestContext(slug, locationId);
  }

  @Post('o/:slug/l/:locationId/requests')
  createRequest(
    @Param('slug') slug: string,
    @Param('locationId') locationId: string,
    @Body() dto: CreatePublicRequestDto,
  ) {
    return this.publicService.createRequest(
      slug,
      locationId,
      dto.offeringTypeId,
      dto.guestName,
      dto.notes,
    );
  }
}
