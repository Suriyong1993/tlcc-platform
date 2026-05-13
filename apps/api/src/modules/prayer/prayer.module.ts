import { Module } from '@nestjs/common';
import { PrayersService } from './prayer.service';
import { PrayersController } from './prayer.controller';

@Module({ controllers: [PrayersController], providers: [PrayersService], exports: [PrayersService] })
export class PrayersModule {}
