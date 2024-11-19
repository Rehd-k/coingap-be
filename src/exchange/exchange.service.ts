import { Injectable } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { OkxService } from './okx.service';
import { BybitService } from './bybit.service';
import { handleExchanges } from 'src/helpers/general/remusdt';
import { KrakenService } from './kraken.service';
import { cryptoExchanges } from 'src/helpers/general/exchanges';

@Injectable()
export class ExchangeService {
  constructor(
    private byBit: BybitService,
    private okx: OkxService,
    private binance: BinanceService,
    private kraken: KrakenService,
  ) {
    handleExchanges(cryptoExchanges);
  }

  // async getChangesList() {
  //   let listToReturn: CoinsType[] = [];
  //   await this.binance.getCoinData();
  //   await this.okx.getCoinData();
  //   await this.byBit.getCoinData();
  //   listToReturn = exchangeList;
  //   handleExchanges(cryptoExchanges);
  //   return listToReturn;
  // }
}
