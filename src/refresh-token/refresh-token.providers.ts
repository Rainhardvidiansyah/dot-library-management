import { CreateRepositoryProviders } from "src/database/database.provider";
import { RefreshTokenEntity } from "./entities/refresh-token.entity";

export const refreshTokenProviders = [CreateRepositoryProviders('REFRESH_TOKEN_REPOSITORY', RefreshTokenEntity)];