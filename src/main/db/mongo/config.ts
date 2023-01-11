import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class ConfigMongo implements MongooseOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.getUri(),
    };
  }

  getUri(): string {
    const connectionString = this.config.get('database.connectionString');
    console.log('connection : ', connectionString);
    return connectionString;
  }
}
