import { ConfigModule } from '@nestjs/config';

import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ColorModule } from './color/color.module';
import { NotificationsModule } from './notifications/notifications.module';
import { StatsModule } from './stats/stats.module';
import { PostModule } from './post/post.module';
import { PetModule } from './pet/pet.module';
import { GeometryModule } from './geometry/geometry.module';
import { BreedModule } from './breed/breed.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    PrismaModule,
    ColorModule,
    NotificationsModule,
    StatsModule,
    PostModule,
    PetModule,
    GeometryModule,
    BreedModule,
    CloudinaryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
