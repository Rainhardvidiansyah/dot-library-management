import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { DatabaseModule } from 'src/database/database.module';
import { roleProviders } from './roles.providers';

@Module({
  imports: [DatabaseModule],
  providers: [
    RolesService,
    ...roleProviders,
  ],
  exports: [RolesService]
})
export class RolesModule {}
