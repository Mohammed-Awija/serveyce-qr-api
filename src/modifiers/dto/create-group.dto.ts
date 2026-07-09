import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ModifierSelectionType } from '@prisma/client';

export class CreateGroupDto {
  @IsUUID()
  offeringNodeId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsEnum(ModifierSelectionType)
  @IsOptional()
  selectionType?: ModifierSelectionType;

  @IsBoolean()
  @IsOptional()
  required?: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  displayOrder?: number;
}
