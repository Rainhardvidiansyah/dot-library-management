import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { userProviders } from './users.providers';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [DatabaseModule, RolesModule],
  providers: [UsersService, ...userProviders],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
