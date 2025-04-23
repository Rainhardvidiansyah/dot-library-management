import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { bookProviders } from './books.providers';
import { DatabaseModule } from 'src/database/database.module';
import { AuthorsModule } from 'src/authors/authors.module';
import { RedisModule } from 'src/redis/redis.module';
import { JobsModule } from 'src/jobs/jobs.module';

@Module({
  imports: [
    RedisModule,
    JobsModule,
    DatabaseModule,
    AuthorsModule,
  ],
  providers: [
    ...bookProviders,
    BooksService],
  controllers: [BooksController]
})
export class BooksModule {}
