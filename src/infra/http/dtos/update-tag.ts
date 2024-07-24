import { IsOptional, IsString } from 'class-validator';

export class UpdateTagDto {
  @IsString()
  @IsOptional()
  value?: string;
}
