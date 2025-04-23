import { Module } from '@nestjs/common';
import { BorrowingsService } from './borrowings.service';
import { BorrowingsController } from './borrowings.controller';
import { borrowingProviders } from './borrowing.providers';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { BooksModule } from 'src/books/books.module';

@Module({
  imports:[DatabaseModule, UsersModule, BooksModule],
  providers: [
    BorrowingsService, 
    ...borrowingProviders],
  controllers: [BorrowingsController]
})
export class BorrowingsModule {}
