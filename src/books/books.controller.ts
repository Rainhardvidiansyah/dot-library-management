import { Body, Controller, Get, Logger, Post, Query, Res } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('BOOKS')
@Controller('api/v1/books')
export class BooksController {

  private logger = new Logger(BooksController.name, {timestamp: true});

  constructor(
    private readonly bookService: BooksService,
  ){}


  //TODO: CHANGE THIS METHOD FOR LIBRARIAN AND ADMIN

  @ApiResponse({ status: 201, description: 'Saving book is done successfully'})
  @ApiBody({
    type: CreateBookDto,
    description: 'Json structure for Book object',
    })
  @Post('/save')
  @Roles('LIBRARIAN')
  async saveBook(@Body() bookDto: CreateBookDto, @Res() res){
    await this.bookService.saveBook(bookDto)
    res.status(201).json({
      message: 'Saving book is done successfully'
    })
  }

  //TODO: CHANGE THIS METHOD FOR LIBRARIAN ADMIN, AND MEMBER
  @Get('search')
  @Public()
  async getAllBooksByAuthorName(@Query('authorName') authorName: string){
    this.logger.debug(`Author name: ${authorName}`)
    return await this.bookService.findBooksByAuthorName(authorName);
  }

  @Get()
  @Roles('MEMBER', 'LIBRARIAN')
  //access like this in case I forget: localhost:3000/api/v1/books?query=hegel
  async getBooksFromGoogleAPi(@Query('query') query: string){
    return await this.bookService.searchGoogleBooks(query)
  }


}
