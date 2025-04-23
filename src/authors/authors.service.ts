import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { AuthorsEntity } from './entities/author.entity';
import { BooksEntity } from 'src/books/books.entity';

@Injectable()
export class AuthorsService {

  constructor(
    @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
    @Inject('AUTHOR_REPOSITORY') private readonly userRepository: Repository<AuthorsEntity>
  ){}


  async saveAuthor(authorName: string, queryRunner: QueryRunner): Promise<AuthorsEntity>{
    
    try{
      const author = await queryRunner.manager.save(AuthorsEntity, {
        authorName: authorName,
      });

      return author;

    }catch(error){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: "error when saving Author"
      }, HttpStatus.BAD_REQUEST, {
        cause: error.message,
      })
    }
  }


}
