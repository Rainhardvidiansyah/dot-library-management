import { AuthorsEntity } from "src/authors/entities/author.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('books')
export class BooksEntity{
  
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    name: 'title',
    nullable: false,
    type: 'varchar',
  })
  title: string;

  @Column({
    name: 'publisher',
    nullable: true,
    type: 'varchar',
  })
  publisher: string;

  @Column({
    name: 'stock',
    nullable: false
  })
  stock: number

  @Column({
    name: 'published_year',
    nullable: true
  })
  publishedYear: number;

  @Column({
    name: 'is_available',
    default: true // if stock === 1, set to false. 
  })
  isAvailable: boolean;

  @ManyToMany(() => AuthorsEntity, (author) => author.books)
  authors: AuthorsEntity[];

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