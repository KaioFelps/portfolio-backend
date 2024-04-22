import { IsOptional, IsString } from 'class-validator';
import { PaginatedQueryDto } from './paginated-query';

export class PaginatedPostListDto extends PaginatedQueryDto {
  @IsOptional()
  @IsString()
  tag?: string;
}
