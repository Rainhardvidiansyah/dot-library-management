import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { privateDecrypt } from 'crypto';
import { DataSource, Repository } from 'typeorm';
import { BooksEntity } from './books.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { AuthorsService } from 'src/authors/authors.service';
import { AuthorsEntity } from 'src/authors/entities/author.entity';

@Injectable()
export class BooksService {

  private logger = new Logger(BooksService.name, {timestamp: true});

  constructor(
    @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
    @Inject('BOOK_REPOSITORY') private readonly bookRepository: Repository<BooksEntity>, 
    private readonly authorService: AuthorsService
  ){ }


  async saveBook(bookDto: CreateBookDto): Promise<BooksEntity>{
    this.logger.debug(`Start transaction in saving books and authors`)
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const authors: AuthorsEntity[] = [];

    for (const authorDto of bookDto.authors) {
      const author = queryRunner.manager.create(AuthorsEntity, {
        authorName: authorDto.authorName,
      });
      const savedAuthor = await queryRunner.manager.save(AuthorsEntity, author);
      authors.push(savedAuthor);
    }
    

    const book = queryRunner.manager.create(BooksEntity, {
      title: bookDto.title,
      publisher: bookDto.publisher,
      stock: bookDto.stock,
      publishedYear: bookDto.publishedYear,
      authors: authors
    });

    const savedBooks = await queryRunner.manager.save(BooksEntity, book);
    await queryRunner.commitTransaction();
    return savedBooks;

    } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  }finally{
    await queryRunner.release();
  }
}


async findBooksByAuthorName(authorName: string): Promise<BooksEntity[]> {
  return await this.dataSource
    .getRepository(BooksEntity)
    .createQueryBuilder('book')
    .innerJoinAndSelect('book.authors', 'author')
    .where('author.authorName LIKE :authorName', { authorName: `%${authorName}%` })
    .getMany();
}

}
