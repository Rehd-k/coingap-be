import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { OkxService } from './okx.service';
import { BybitService } from './bybit.service';
import { KrakenService } from './kraken.service';
import { cryptoExchanges } from 'src/helpers/general/exchanges';
import { BitfinexService } from './bitfinex.service';
import { BitstampService } from './bitstamp.service';
import { CryptodotcomService } from './cyptodotcom.service';
import { GateioService } from './gateio.service';
import { HuobiService } from './huobi.service';
import { kucoinService } from './kucoin.service';
import { MexcService } from './mexc.service';
// import { PhemexClient } from './phemex.service';
import { PoloniexService } from './poloniex.service';
import { forkJoin } from 'rxjs';
import { coins } from 'src/helpers/general/coins';
import { ExmoService } from './exmo.service';
import { PhemexService } from './phemex.service';
import { BitgetService } from './bitget.service';

@Injectable()
export class ExchangeService {
  constructor(
    // private binance: BinanceService,
    private bitfinex: BitfinexService,
    private bitstamp: BitstampService,
    private byBit: BybitService,
    private bigGet: BitgetService,
    private cryptoDotCom: CryptodotcomService,
    private Gateio: GateioService,
    private Huobi: HuobiService,
    private kraken: KrakenService,
    private kucoin: kucoinService,
    private Mexc: MexcService,
    private okx: OkxService,
    private phemex: PhemexService,
    private Poloniex: PoloniexService,
    private exmo: ExmoService
  ) {

  }
  logger = new Logger

  async getChangesList() {
    let coin_to_be_arranged = []
    let coin_arranged = []

    function getPercentageDifference(oldPrice, newPrice) {
      if (oldPrice === 0) {
        throw new Error("Old price cannot be zero.");
      }
      const difference = Math.abs(newPrice - oldPrice);
      const percentageDifference = (difference / oldPrice) * 100;
      return percentageDifference.toFixed(2); // Format to 2 decimal places
    }
    try {
      const [
        bybit,
        // bitfinex,
        // bitstamp,
        // exmo,
        bitget,
        // poloniex
        // okx,
        // kraken,
        // gateio,
        huobi,
        // kucoin,
        mexc,
        // cryptodotcom,
        // binance
      ] = await Promise.all([
        this.byBit.getCoinData(),
        // this.bitfinex.getCoins(),
        // this.bitstamp.getCoins(),
        // this.exmo.getTicker(),
        this.bigGet.getCoinData(),
        // this.okx.getCoinData(),
        // this.kraken.getCoins(),
        // this.binance.getCoinData(),
        // this.Gateio.getCoinData(),
        this.Huobi.getCoinData(),
        // this.kucoin.getCoinData(),
        this.Mexc.getCoinData(),
        // this.cryptoDotCom.getCoins(),


        // ['this.Poloniex.getCoinData()']
        // this.coinBase.getCoinData(),
        // this.phomex.getCoins(),
        // this.Poloniex.getCoinData()
      ]);



      const full_data = {
        bybit,
        // bitfinex,
        // bitstamp,
        // exmo,
        bitget,
        // poloniex
        // okx,
        // kraken,
        // gateio,
        huobi,
        // kucoin,
        mexc,
        // cryptodotcom,
      }

      function sortPriceData(data) {
        return data.map(subArray => {
          const sortedByPrice = subArray.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
          return {
            coins: `${sortedByPrice[sortedByPrice.length - 1].coin}`,
            diff: getPercentageDifference(sortedByPrice[sortedByPrice.length - 1].price, sortedByPrice[0].price),
            sell_at: {
              coin: sortedByPrice[sortedByPrice.length - 1].coin,
              price: Number(sortedByPrice[sortedByPrice.length - 1].price).toFixed(5),
              volume: Number(sortedByPrice[sortedByPrice.length - 1].volume).toFixed(5),
              askPrice: Number(sortedByPrice[sortedByPrice.length - 1].askPrice).toFixed(5),
              bidPrice: Number(sortedByPrice[sortedByPrice.length - 1].bidPrice).toFixed(5),
              exchange: sortedByPrice[sortedByPrice.length - 1].exchange
            },
            buy_from: {
              coin: sortedByPrice[0].coin,
              price: Number(sortedByPrice[0].price).toFixed(5),
              volume: Number(sortedByPrice[0].volume).toFixed(5),
              askPrice: Number(sortedByPrice[0].askPrice).toFixed(5),
              bidPrice: Number(sortedByPrice[0].bidPrice).toFixed(5),
              exchange: sortedByPrice[0].exchange

            }
          };
        });
      }

      for (const coin of coins) {

        for (let key in full_data) {
          if (full_data.hasOwnProperty(key)) {
            let value = full_data[key];
            let found
            for (const iterator of value) {
              if (iterator.coin === coin) {
                found = iterator
              }
            }
            if (found) {
              found.exchange = `${key}`;
              coin_to_be_arranged.push(found);
            }

          }
        }
        if (coin_to_be_arranged.length > 0) {
          coin_arranged.push((coin_to_be_arranged))
          coin_to_be_arranged = []
        }
      }

      return sortPriceData(coin_arranged).sort((a, b) => parseFloat(b.diff) - parseFloat(a.diff))

    } catch (err) {
      throw new BadRequestException(err);
    }

  }
}
