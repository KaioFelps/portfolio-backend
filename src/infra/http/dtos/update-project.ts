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
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  links?: string[];
}
