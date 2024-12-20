import { Module } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { ExchangeService } from './exchange.service';
import { HttpModule } from '@nestjs/axios';
import { ApiServices } from 'src/helpers/apiConnectors/apis';
import { OkxService } from './okx.service';
import { BybitService } from './bybit.service';
import { KrakenService } from './kraken.service';
import { BitfinexService } from './bitfinex.service';
import { BitgetService } from './bitget.service';
import { BitstampService } from './bitstamp.service';
import { CoinbaseService } from './coinbasepro.service';
import { CryptodotcomService } from './cyptodotcom.service';
import { GateioService } from './gateio.service';
import { HuobiService } from './huobi.service';
import { kucoinService } from './kucoin.service';
import { MexcService } from './mexc.service';
import { PhemexClient } from './phemex.service';
import { PoloniexService } from './poloniex.service';
import { MarketsController } from 'src/markets/markets.controller';

@Module({
  providers: [
    ApiServices,
    BinanceService,
    ExchangeService,
    OkxService,
    BybitService,
    KrakenService,
    BitfinexService,
    BitgetService,
    BitstampService,
    BybitService,
    CoinbaseService,
    CryptodotcomService,
    GateioService,
    HuobiService,
    kucoinService,
    MexcService,
    PhemexClient,
    PoloniexService
  ],
  imports: [HttpModule],
  controllers: [MarketsController],
})
export class ExchangeModule {}
