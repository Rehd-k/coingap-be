import { BadRequestException, Injectable } from '@nestjs/common';

import { ApiServices } from 'src/helpers/apiConnectors/apis';
import {
  exchangeList,
  removeAllNonUSDTCoins,
} from 'src/helpers/general/remusdt';

@Injectable()
export class BinanceService {
  constructor(private api: ApiServices) { }

  async getCoinData() {
    // let data: any;
    // try {
    //   data = await this.api.binanceClient.getTradingDayTicker({
    //     // type: 'FULL',
    //     // symbols: coins,
    //   });
    //   const data_only_usdt = removeAllNonUSDTCoins(data.result.list);
    //   return this._getCoinPrices(data_only_usdt);
    // } catch (err) {
    //   throw new BadRequestException(err);
    // }
    return []
  }

  private _getCoinPrices(data_only_usdt) {
    let priceses = [];


    data_only_usdt.map((coins) => {
      priceses.push(
        {
          coin: coins.symbol[0],
          price: coins.lastPrice,
          volume: coins.quoteVolume,
          askPrice: coins.lowPrice,
          bidPrice: coins.highPrice,
        }
      )
      // exchangeList.map((res) => {
      //   if (res.name === 'Binance') {
      //     res.info.push({
      //       coin: coins.symbol[0],
      //       price: coins.lastPrice,
      //       volume: coins.quoteVolume,
      //       askPrice: coins.lowPrice,
      //       bidPrice: coins.highPrice,
      //     });
      //   }
      // });
    });

    return priceses
  }
}
