import { BooksEntity } from "src/books/books.entity";
import { User } from "src/common/decorators/user.decorator";
import { UsersEntity } from "src/users/entities/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('borrowings')
export class BorrowingsEntity{

  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  book_id: number;

  @PrimaryColumn({
    name: 'borrowed_at',
    type: 'datetime' })
  borrowedAt: Date = new Date();

  @Column({ 
    name: 'returned_at',
    type: 'datetime',
    nullable: true })
  returnedAt: Date;

  @Column({
    name: 'due_date',
    type: 'datetime',
    nullable: false
  })
  dueDate: Date;

  @Column({ type: 'enum', enum: ['borrowed', 'returned'], default: 'borrowed' })
  status: 'borrowed' | 'returned';

  @ManyToOne(() => UsersEntity, (user) => user.borrowings)
  @JoinColumn({name: 'user_id'})
  user: UsersEntity;

  @ManyToOne(() => BooksEntity, (book) => book.borrowings)
  @JoinColumn({name: 'book_id'})
  book: BooksEntity;
}