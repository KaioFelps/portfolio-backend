import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  topstory?: string;

  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsArray()
  @IsString({ each: true })
  links?: string[];
}
