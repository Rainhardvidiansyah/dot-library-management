import { CreateRepositoryProviders } from "src/database/database.provider";
import { RolesEntity } from "./entities/roles.entity";

export const roleProviders = [CreateRepositoryProviders('ROLES_REPOSITORY', RolesEntity)];