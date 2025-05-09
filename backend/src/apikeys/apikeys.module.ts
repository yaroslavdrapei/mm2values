import { forwardRef, Module } from '@nestjs/common';
import { ApikeysController } from './apikeys.controller';
import { ApikeysService } from './apikeys.service';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Apikey, ApikeySchema } from '@shared/schemas/apikey.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Apikey.name, schema: ApikeySchema }]), forwardRef(() => UsersModule)],
  controllers: [ApikeysController],
  providers: [ApikeysService],
  exports: [ApikeysService]
})
export class ApikeysModule {}
