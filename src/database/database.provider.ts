import { ConfigService } from '@nestjs/config';
import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';

export const DatabaseProviders = [
  {
    provide: 'DATA_SOURCE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];

export function CreateRepositoryProviders(
  repositoryName: string,
  entityTarget: EntityTarget<ObjectLiteral>,
) {
  return {
    provide: repositoryName,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(entityTarget),
    inject: ['DATA_SOURCE'],
  };
}
