import { CreateRepositoryProviders } from "src/database/database.provider";
import { BooksEntity } from "./books.entity";


export const bookProviders = [CreateRepositoryProviders('BOOK_REPOSITORY', BooksEntity)];