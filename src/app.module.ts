import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigModule } from './app-config/app-config.module';
import { DatabaseConfigService } from './database-config/database-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AppConfigModule,
    ImageModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useClass: DatabaseConfigService,
    }),
  ],
  controllers: [],
  providers: [DatabaseConfigService],
})
export class AppModule {
}
