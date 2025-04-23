import { CreateRepositoryProviders } from "src/database/database.provider";
import { BorrowingsEntity } from "./entities/borrowings.entity";

export const borrowingProviders = [CreateRepositoryProviders('BORROWING_REPOSITORY', BorrowingsEntity)];