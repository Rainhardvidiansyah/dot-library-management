import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { authorProviders } from './author.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...authorProviders,
    AuthorsService
  ],
  exports: [AuthorsService]
})
export class AuthorsModule {}
