import { CreateRepositoryProviders } from 'src/database/database.provider';
import { UsersEntity } from './entities/users.entity';

export const userProviders = [CreateRepositoryProviders('USER_REPOSITORY', UsersEntity)];
