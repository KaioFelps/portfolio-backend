import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthenticateService } from '@/domain/users/services/authenticate-service';
import { CryptographyModule } from '../crypt/cryptography.module';
import { DatabaseModule } from '../db/database.module';

@Module({
  imports: [CryptographyModule, DatabaseModule],
  controllers: [AuthController],
  providers: [AuthenticateService],
})
export class HttpModule {}
