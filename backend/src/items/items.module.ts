import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from '@shared/schemas/item.schema';
import { ApikeysModule } from 'src/apikeys/apikeys.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]), ApikeysModule],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService]
})
export class ItemsModule {}
