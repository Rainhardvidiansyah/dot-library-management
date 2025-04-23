import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BorrowingsEntity } from './entities/borrowings.entity';
import { BorrowBooksDto } from './dto/borrow-book.dto';
import { UsersService } from 'src/users/users.service';
import { BooksService } from 'src/books/books.service';

@Injectable()
export class BorrowingsService {

  constructor(
    @Inject('BORROWING_REPOSITORY') private readonly borrowingRepository: Repository<BorrowingsEntity>,
    private readonly userService: UsersService,
    private readonly bookService: BooksService,
  ){}

  async borrowBooks(userId: number, bookId: number): Promise<BorrowingsEntity>{

    const user = await this.userService.findUserById(userId);
    const book = await this.bookService.findBookById(bookId);

    const borrowedAt = new Date();
    const dueDate = new Date(borrowedAt);
    dueDate.setDate(dueDate.getDate() + 14); //2 weeks

    const createBorrowedBook = this.borrowingRepository.create({
      user: user,
      book: book,
      borrowedAt: borrowedAt,
      dueDate: dueDate,
      status: 'borrowed'
    })

    const savedBook = await this.borrowingRepository.save(createBorrowedBook);
    return savedBook;
  }


  async findBorrowedBooksByUser(userId: number){
    const books = await this.borrowingRepository.find({
      where: { user: {id: userId}},
      relations: ['book'],
      order: { borrowedAt: 'desc'}
    })

    return books;
  }

}
