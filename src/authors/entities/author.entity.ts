import { BooksEntity } from "src/books/entities/books.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('authors')
export class AuthorsEntity{

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'author_name',
    nullable: false
  })
  authorName: string

  @ManyToMany(() => BooksEntity, (book) => book.authors)
  @JoinTable({
    name: 'authors_books',
    joinColumn: { name: 'author_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'book_id', referencedColumnName: 'id' },
  })
  books: BooksEntity[];

  @CreateDateColumn({
    name: "created_at"
  })
  createdAt: Date;
  
  @UpdateDateColumn({
    name: "updated_at"
  })
  updatedAt: Date;
    
  @DeleteDateColumn({
    name: "deleted_at"
  })
  deletedAt?: Date;


}