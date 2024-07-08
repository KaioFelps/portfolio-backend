import { IsNotEmpty, IsUrl, IsString } from 'class-validator';

export class LinkDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsUrl({ require_protocol: true })
  value!: string;
}
