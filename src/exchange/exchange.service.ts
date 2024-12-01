import { Injectable } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { OkxService } from './okx.service';
import { BybitService } from './bybit.service';
import { handleExchanges } from 'src/helpers/general/remusdt';
import { KrakenService } from './kraken.service';
import { cryptoExchanges } from 'src/helpers/general/exchanges';
import { BitfinexService } from './bitfinex.service';
import { BitstampService } from './bitstamp.service';
import { CoinbaseService } from './coinbasepro.service';
import { CryptodotcomService } from './cyptodotcom.service';
import { GateioService } from './gateio.service';
import { HuobiService } from './huobi.service';
import { kucoinService } from './kucoin.service';
import { MexcService } from './mexc.service';
import { PhemexClient } from './phemex.service';
import { PoloniexService } from './poloniex.service';

@Injectable()
export class ExchangeService {
  constructor(
    private binance: BinanceService,
    private bitfinex: BitfinexService,
    private bitstamp: BitstampService,
    private byBit: BybitService,
    private coinBase: CoinbaseService,
    private cryptoDotCom: CryptodotcomService,
    private Gateio: GateioService,
    private Huobi: HuobiService,
    private kraken: KrakenService,
    private kucoin: kucoinService,
    private Mexc: MexcService,
    private okx: OkxService,
    private phomex: PhemexClient,
    private Poloniex : PoloniexService
  ) {
    handleExchanges(cryptoExchanges);
  }

  async getChangesList() {
    const urls = [
      this.byBit.getCoinData(),
      this.okx.getCoinData(),
      this.binance.getCoinData(),
      this.kraken.getCoins(),
      this.bitfinex.getCoins(),
      this.bitstamp.getCoins(),
      this.coinBase.getCoinData(),
      this.Gateio.getCoinData(),
      this.Huobi.getCoinData(),
      this.kucoin.getCoinData(),
      this.Mexc.getCoinData()
    ]
  }
}
