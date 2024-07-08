import {
  IsArray,
  IsNotEmpty,
  ArrayMinSize,
  IsUrl,
  IsString,
  ValidateNested,
} from 'class-validator';
import { LinkDto } from './link';
import { Type } from 'class-transformer';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  topstory!: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  tags!: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LinkDto)
  links!: Array<LinkDto>;
}
