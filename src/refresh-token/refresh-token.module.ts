import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { refreshTokenProviders } from './refresh-token.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...refreshTokenProviders,
    RefreshTokenService
  ],
    exports: [RefreshTokenService]
})
export class RefreshTokenModule {}
