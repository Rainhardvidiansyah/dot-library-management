import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { ProfilesModule } from './profiles/profiles.module';
import { BooksModule } from './books/books.module';
import { RolesModule } from './roles/roles.module';
import { APP_GUARD } from '@nestjs/core';
import { JWTAuthGuard } from './common/guards/jwt-auth.guards';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    UsersModule,
    AuthenticationModule,
    ProfilesModule,
    BooksModule,
    RolesModule,
    JwtModule,
    RefreshTokenModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    {
      provide: APP_GUARD,
      useClass: JWTAuthGuard

    },
  ],
})
export class AppModule {}
