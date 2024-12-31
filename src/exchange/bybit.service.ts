import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ApiServices } from 'src/helpers/apiConnectors/apis';
import {
  removeAllNonUSDTCoins,
} from 'src/helpers/general/remusdt';
import * as fs from 'fs';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class BybitService {
  constructor(private api: ApiServices, private httpService: HttpService,) { }
  logger = Logger
  async getCoinData() {
    let data: any;
    try {
      data = await firstValueFrom(
        this.httpService.get('https://api.bybit.com/v5/market/tickers?category=spot', {
          maxContentLength: Infinity,
          headers: {
            Accept: 'application/json',
          },
        }).pipe(
          catchError((error: any) => {
            throw new BadRequestException(error);
          }),
        )
      )
      // console.log(data)
      const usefulldata = removeAllNonUSDTCoins(data.data.result.list);
      return this._getCoinPrices(usefulldata);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  private _getCoinPrices(useFulldata) {
    let prices = []

    useFulldata.map((coins) => {
      prices.push(
        {
          coin: coins.symbol,
          price: coins.lastPrice,
          volume: coins.turnover24h,
          askPrice: coins.ask1Price,
          bidPrice: coins.bid1Price,
        }
      )

    });
    return prices
  }
}
