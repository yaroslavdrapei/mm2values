import { Module } from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { InventoriesController } from './inventories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Inventory, InventorySchema } from '@shared/schemas/inventory.schema';
import { UsersModule } from 'src/users/users.module';
import { ItemsModule } from 'src/items/items.module';
import { Item, ItemSchema } from '@shared/schemas/item.schema';
import { ApikeysModule } from 'src/apikeys/apikeys.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inventory.name, schema: InventorySchema },
      { name: Item.name, schema: ItemSchema }
    ]),
    UsersModule,
    ItemsModule,
    ApikeysModule
  ],
  providers: [InventoriesService],
  controllers: [InventoriesController]
})
export class InventoriesModule {}
