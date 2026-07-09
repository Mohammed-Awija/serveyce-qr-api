import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateOptionDto {
  @IsUUID()
  modifierGroupId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  displayOrder?: number;
}
