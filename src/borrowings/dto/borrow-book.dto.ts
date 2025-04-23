import { IsNotEmpty } from "class-validator";

export class BorrowBooksDto{
  
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  bookId: number;
}