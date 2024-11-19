import { Module } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { ExchangeService } from './exchange.service';
import { HttpModule } from '@nestjs/axios';
import { ApiServices } from 'src/helpers/apiConnectors/apis';
import { OkxService } from './okx.service';
import { BybitService } from './bybit.service';
import { KrakenService } from './kraken.service';

@Module({
  providers: [
    ApiServices,
    BinanceService,
    ExchangeService,
    OkxService,
    BybitService,
    KrakenService,
  ],
  imports: [HttpModule],
})
export class ExchangeModule {}
