import { PartialType } from '@nestjs/mapped-types';
import { CreateOfferingNodeDto } from './create-offering-node.dto';

export class UpdateOfferingNodeDto extends PartialType(CreateOfferingNodeDto) {}
