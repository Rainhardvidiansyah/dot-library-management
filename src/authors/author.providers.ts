import { CreateRepositoryProviders } from "src/database/database.provider";
import { AuthorsEntity } from "./entities/author.entity";

export const authorProviders = [CreateRepositoryProviders("AUTHOR_REPOSITORY", AuthorsEntity)];