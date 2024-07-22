import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from './pagination';

export class PaginatedPostListDto extends PaginationDto {
  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsString()
  title?: string;
}
