import { Controller, Get, Logger, Param, Post, Res } from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { BorrowingsService } from './borrowings.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('BORROWING A BOOKS')
@Controller('api/v1/borrowings')
export class BorrowingsController {

  private logger = new Logger(BorrowingsController.name, {timestamp: true});

  constructor(
    private readonly borrowService: BorrowingsService
  ){}

  @Post(':bookId')
  @Roles('MEMBER', 'ADMIN')
  async borrowABook(@Param('bookId')bookId: number, @User() user, @Res() res){
    this.logger.log(`User in borrowing book controller ${JSON.stringify(user)}`)

    const userId = user.id;
    const borrowedBook = await this.borrowService.borrowBooks(userId, bookId);

    res.status(200)
    .json({
      message: 'User just borrow a book',
      book_title: borrowedBook.book.title
    });
  }

  @Get('me')
  @Roles('MEMBER', 'ADMIN')
  async getAllBorrowedBooksByUser(@User() user){
    const userId = user.id;
    return await this.borrowService.findBorrowedBooksByUser(userId);
  }

}
