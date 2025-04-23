import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { privateDecrypt } from 'crypto';
import { DataSource, Repository } from 'typeorm';
import { BooksEntity } from './books.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { AuthorsService } from 'src/authors/authors.service';
import { AuthorsEntity } from 'src/authors/entities/author.entity';
import Redis from 'ioredis';
import { JobsService } from 'src/jobs/jobs.service';

@Injectable()
export class BooksService {

  private logger = new Logger(BooksService.name, {timestamp: true});

  constructor(
    @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
    @Inject('BOOK_REPOSITORY') private readonly bookRepository: Repository<BooksEntity>, 
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private readonly jobService: JobsService,
    private readonly authorService: AuthorsService
  ){ }


  async findBookById(id: number): Promise<BooksEntity>{
    const book = await this.bookRepository.findOne({
      where: {id: id},
    });
    return book;
  }

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
      await this.jobService.addNewJob({author: savedAuthor.authorName});
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

  const cacheKey = `books_by_author_${authorName}`;

    const cachedData = await this.redisClient.get(cacheKey);
    this.logger.debug(`CACHED DATA: ${cachedData}`);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

  const books =  await this.dataSource
    .getRepository(BooksEntity)
    .createQueryBuilder('book')
    .innerJoinAndSelect('book.authors', 'author')
    .where('author.authorName LIKE :authorName', { authorName: `%${authorName}%` })
    .getMany();
    
    await this.redisClient.set(cacheKey, JSON.stringify(books), 'EX', 300); //Five minutes ttl 
    
    return books;
}

}
