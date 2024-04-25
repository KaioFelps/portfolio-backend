import {
  IsArray,
  IsNotEmpty,
  ArrayMinSize,
  IsUrl,
  IsString,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class CreatePostDto {
  @IsOptional()
  @IsUUID()
  authorId?: string;

  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  content!: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  topstory!: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  tags!: string[];
}
