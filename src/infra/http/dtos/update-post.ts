import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  topstory?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];
}
