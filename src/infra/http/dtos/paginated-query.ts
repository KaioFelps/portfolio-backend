import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginatedQueryDto {
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  query?: string;
}
