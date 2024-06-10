import { ConfigModule } from '@nestjs/config';

import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ColorModule } from './color/color.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    PrismaModule,
    ColorModule,
    StatsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
