import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './passport/jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import ms from 'ms';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from 'src/decorator/customize';
import { UserSchema } from 'src/users/schemas/user.schema';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [UsersModule, RolesModule, PassportModule, JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      signOptions: {
        expiresIn: ms(configService.get<string>('JWT_ACCESS_TOKEN_EXPIRE')) / 1000,
      },
    }),
    inject: [ConfigService],
  }),],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule { }
