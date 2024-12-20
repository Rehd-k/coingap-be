import { Injectable, Logger } from '@nestjs/common';
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
import { forkJoin } from 'rxjs';
import { coins } from 'src/helpers/general/coins';

@Injectable()
export class ExchangeService {
  constructor(
    private binance: BinanceService,
    private bitfinex: BitfinexService,
    private bitstamp: BitstampService,
    private byBit: BybitService,
    // private coinBase: CoinbaseService,
    private cryptoDotCom: CryptodotcomService,
    private Gateio: GateioService,
    private Huobi: HuobiService,
    private kraken: KrakenService,
    private kucoin: kucoinService,
    private Mexc: MexcService,
    private okx: OkxService,
    private phomex: PhemexClient,
    private Poloniex: PoloniexService
  ) {

  }
  logger = new Logger

  async getChangesList() {
    let coin_to_be_arranged = []
    let coin_arranged = []
    try {
      const [bybit,
        //  okx, kraken, bitfinex, bitstamp, gateio, huobi, kucoin, mexc, phomex, poloniex
      ] = await Promise.all([
        this.byBit.getCoinData(),
        // this.okx.getCoinData(),
        // this.binance.getCoinData(),
        // this.kraken.getCoins(),
        // this.bitfinex.getCoins(),
        // this.bitstamp.getCoins(),
        // this.coinBase.getCoinData(),
        // this.Gateio.getCoinData(),
        // this.Huobi.getCoinData(),
        // this.kucoin.getCoinData(),
        // this.Mexc.getCoinData(),
        // this.phomex.getCoins(),
        // this.Poloniex.getCoinData()
      ]);

      const full_data = {
        bybit
        // okx, kraken, bitfinex, bitstamp, gateio, huobi, kucoin, mexc, phomex, poloniex
      }


      const findHighestAndLowestPrices = (array) => {
        if (array.length === 0) return { highest: null, lowest: null };

        let highest = array[0];
        let lowest = array[0];

        for (const item of array) {
          if (item.price > highest.price) {
            highest = item;
          }
          if (item.price < lowest.price) {
            lowest = item;
          }
        }

        return { sell_at: highest, buy_from: lowest };
      };

      for (const coin of coins) {
        // [
        //   {
        //     name: 'BTC',
        //     info: [
        //       ,
        //       {
        //         vol: 0,
        //         ask: 0,
        //         bid: 0,
        //         exchange: 'OKx'
        //       },
        //       ,
        //       {
        //         vol: 0,
        //         ask: 0,
        //         bid: 0,
        //         exchange: 'bybit'
        //       }
        //     ]
        //   },
        //   {
        //     name: 'BTC',
        //     info: [
        //       {
        //         vol: 0,
        //         ask: 0,
        //         bid: 0,
        //         exchange: 'ByBit'
        //       },
        //       {
        //         vol: 0,
        //         ask: 0,
        //         bid: 0,
        //         exchange: 'OKx'
        //       }
        //     ]
        //   }

        // ]
        console.log(coin)
        for (let key in full_data) {
          if (full_data.hasOwnProperty(key)) {
            let value = full_data[key];

            let found = value.find(res => {
              if (res.coin === coin) {
                // console.log()
                return res
              }
            })
            found.exchange = `${key}`;
            coin_to_be_arranged.push(found);
          }
        }
        coin_arranged.push(findHighestAndLowestPrices(coin_to_be_arranged))
        coin_to_be_arranged = []
      }



      // console.log(coin_arranged)

      return coin_arranged;
    } catch (err) {
      // this.logger.log(coin_arranged)
      this.logger.error(err)
    }

  }
}
