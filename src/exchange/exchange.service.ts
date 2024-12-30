import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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

    function getPercentageDifference(oldPrice, newPrice) {
      if (oldPrice === 0) {
        throw new Error("Old price cannot be zero.");
      }
      const difference = Math.abs(newPrice - oldPrice);
      const percentageDifference = (difference / oldPrice) * 100;
      return percentageDifference.toFixed(2); // Format to 2 decimal places
    }
    try {
      // mexc, phomex, poloniex ,
      const [
        okx,
        bybit,
        kraken,
        bitfinex,
        gateio,
        huobi,
        kucoin,
        mexc,
        // phomex,
        // poloniex
      ] = await Promise.all([
        this.byBit.getCoinData(),
        this.okx.getCoinData(),
        this.kraken.getCoins(),
        // this.binance.getCoinData(),

        this.bitfinex.getCoins(),
        this.Gateio.getCoinData(),
        this.Huobi.getCoinData(),
        this.kucoin.getCoinData(),
        this.Mexc.getCoinData(),
        // ['this.phomex.getCoins()'],
        // ['this.Poloniex.getCoinData()']
        // this.bitstamp.getCoins(),
        // this.coinBase.getCoinData(),


        // ,
        // 
        // this.phomex.getCoins(),
        // this.Poloniex.getCoinData()
      ]);



      const full_data = {
        okx,
        bybit,
        kraken,
        bitfinex,
        gateio,
        huobi,
        kucoin,
        mexc,
        // phomex,

      }

      // return full_data
      //  phomex, poloniex 


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

        let value = {
          coins: `${highest.coin}/USDT`,
          diff: getPercentageDifference(highest.price, lowest.price),
          sell_at: {
            "coin": highest.coin,
            "price": Number(highest.price).toFixed(5),
            "volume": Number(highest.volume).toFixed(5),
            "askPrice": Number(highest.askPrice).toFixed(5),
            "bidPrice": Number(highest.bidPrice).toFixed(5),
            "exchange": highest.exchange
          },
          buy_from: {
            "coin": `${lowest.coin}/USDT`,
            "price": Number(lowest.price).toFixed(5),
            "volume": Number(lowest.volume).toFixed(5),
            "askPrice": Number(lowest.askPrice).toFixed(5),
            "bidPrice": Number(lowest.bidPrice).toFixed(5),
            "exchange": lowest.exchange
          }
        }

        return value;
      };

      for (const coin of coins) {
        let found
        for (let key in full_data) {
          if (full_data.hasOwnProperty(key)) {
            let value = full_data[key];
            found = value.find(res => {
              if (res.coin === coin) {

                return res
              }
            })
            if (found) {
              found.exchange = `${key}`;
              coin_to_be_arranged.push(found);
            }

          }
        }
        if (found) {
          coin_arranged.push(findHighestAndLowestPrices(coin_to_be_arranged))
          coin_to_be_arranged = []
        }
      }

      return coin_arranged.sort((a, b) => parseFloat(b.diff) - parseFloat(a.diff));
    } catch (err) {
      throw new BadRequestException(err);
    }

  }
}
