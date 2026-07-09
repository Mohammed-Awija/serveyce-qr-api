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
import { OfferingNodeType } from '@prisma/client';

export class CreateOfferingNodeDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsEnum(OfferingNodeType)
  @IsOptional()
  type?: OfferingNodeType;

  @IsUUID()
  @IsOptional()
  parentId?: string;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  icon?: string;

  @IsBoolean()
  @IsOptional()
  enabled?: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  displayOrder?: number;
}
