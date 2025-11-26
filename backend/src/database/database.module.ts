// backend/src/database/database.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    // ConfigModule global para leer .env en toda la app
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Conexión a Mongo
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
        dbName: config.get<string>('MONGO_DB_NAME'),
      }),
    }),
  ],
})
export class DatabaseModule {}
