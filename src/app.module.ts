import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigModule } from './app-config/app-config.module';
import { DatabaseConfigService } from './config/database-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageModule } from './image/image.module';
import { S3Module } from 'nestjs-s3';
import { S3ConfigService } from './config/s3-config.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AppConfigModule,
    ImageModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useClass: DatabaseConfigService,
    }),
    S3Module.forRootAsync({
      imports: [AppConfigModule],
      useClass: S3ConfigService,
    }),
  ],
  controllers: [],
  providers: [DatabaseConfigService, S3ConfigService],
})
export class AppModule {
}
