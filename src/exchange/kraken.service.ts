import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import * as fs from 'fs';

import { ApiServices } from 'src/helpers/apiConnectors/apis';
type ApiResponse = {
  result: {
    [key: string]: {
      a: string[];
      b: string[];
      c: string[];
      v: string[];
    };
  };
};

type TransformedData = {
  coin: string;
  price: string;
  volume: string;
  askPrice: string;
  bidPrice: string;
}[];

@Injectable()
export class KrakenService {
  constructor(
    private HttpService: HttpService,
    private api: ApiServices,
  ) { }

  async getCoins() {
    const { data } = await firstValueFrom(
      this.HttpService.get('https://api.kraken.com/0/public/Ticker', {
        maxContentLength: Infinity,
        headers: {
          Accept: 'application/json',
        },
      }).pipe(
        catchError((error: any) => {
          throw new BadRequestException(error);
        }),
      ),
    );
    return this.transformApiResponse(data);
  }

  /**
   *
   * @param apiData full data gotten from the api
   */
  transformApiResponse(response: ApiResponse) {
    const transformed: TransformedData = [];

    Object.entries(response.result).forEach(([coinPair, data]) => {
      // Only process pairs that end with "USDT"
      if (coinPair.endsWith('USDT')) {
        // Remove "USDT" and keep the first part of the pair
        const coin = coinPair.replace('USDT', '');

        // Extract necessary fields
        const price = data.c[0]; // "c" represents price
        const volume = data.v[0]; // "v" represents volume
        const askPrice = data.a[0]; // "a" represents askPrice
        const bidPrice = data.b[0]; // "b" represents bidPrice

        // Push the transformed data
        transformed.push({
          coin,
          price,
          volume,
          askPrice,
          bidPrice,
        });
      }
    });
   return this._getCoinPrices(transformed);
  }
  private _getCoinPrices(useFulldata) {
    let prices = useFulldata

   
    return prices
    // exchangeList.map((res) => {
    //   if (res.name === 'OKX') {
    //     res.info = useFulldata;
    //   }
    // });
    // console.log(exchangeList);

  }
}
