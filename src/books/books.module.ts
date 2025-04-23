import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { bookProviders } from './books.providers';
import { DatabaseModule } from 'src/database/database.module';
import { AuthorsModule } from 'src/authors/authors.module';

@Module({
  imports: [
    DatabaseModule,
    AuthorsModule,
  ],
  providers: [
    ...bookProviders,
    BooksService],
  controllers: [BooksController]
})
export class BooksModule {}
