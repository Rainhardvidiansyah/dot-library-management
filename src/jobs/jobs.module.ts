import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { BullModule } from '@nestjs/bull';
import { JobsProcessor } from './jobs.processor';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          db: configService.get<number>('REDIS_DB'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'jobs',
    }),
  ],
  providers: [JobsService, JobsProcessor],
  exports: [JobsService]
})
export class JobsModule {}
