import { ConfigModule } from '@nestjs/config';

import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ColorModule } from './color/color.module';
import { PetModule } from './pet/pet.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    PrismaModule,
    ColorModule,
    PetModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
