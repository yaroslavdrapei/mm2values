import { Module } from '@nestjs/common';
import { ItemsModule } from './items/items.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { InventoriesModule } from './inventories/inventories.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApikeysModule } from './apikeys/apikeys.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI')
      })
    }),
    ItemsModule,
    UsersModule,
    InventoriesModule,
    ApikeysModule
  ]
})
export class AppModule {}
