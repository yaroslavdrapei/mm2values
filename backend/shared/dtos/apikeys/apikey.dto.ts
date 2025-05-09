import { Expose } from 'class-transformer';

export class ApikeyDto {
  @Expose()
  key: string;
}
