import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreatePublicRequestDto {
  @IsUUID()
  offeringTypeId: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  guestName?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  notes?: string;
}
