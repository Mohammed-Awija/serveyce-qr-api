import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { LocationKind } from '@prisma/client';

export class CreateLocationDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsEnum(LocationKind)
  @IsOptional()
  kind?: LocationKind;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  displayName?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  notes?: string;
}
