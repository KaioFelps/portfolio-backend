import {
  IsArray,
  IsNotEmpty,
  ArrayMinSize,
  IsUrl,
  IsString,
} from 'class-validator';

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
  @IsUrl({ require_protocol: true }, { each: true })
  links!: string[];
}
