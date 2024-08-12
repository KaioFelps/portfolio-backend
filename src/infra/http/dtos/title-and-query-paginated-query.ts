import { IsNumber, IsOptional, IsString } from 'class-validator';

export class TitleAndTagPaginatedQueryDto {
  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  amount?: number;
}
