import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class SelectionDto {
  @IsString()
  groupName: string;

  @IsArray()
  @IsString({ each: true })
  optionNames: string[];
}

export class CreatePublicRequestDto {
  @IsUUID()
  offeringNodeId: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SelectionDto)
  selections?: SelectionDto[];

  @IsString()
  @MaxLength(100)
  @IsOptional()
  guestName?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  notes?: string;
}
