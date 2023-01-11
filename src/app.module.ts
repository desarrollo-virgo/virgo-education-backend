import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MainModule } from './main/main.module';

@Module({
  imports: [MainModule, HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
