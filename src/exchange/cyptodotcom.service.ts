import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { firstValueFrom, catchError } from 'rxjs';
import { exchangeList } from 'src/helpers/general/remusdt';

@Injectable()
export class CryptodotcomService {
  constructor(private httpService: HttpService) { }

  async getCoins() {
    const { data } = await firstValueFrom(
      this.httpService
        .get('https://api.crypto.com/exchange/v1/public/get-tickers', {
          maxContentLength: Infinity,
          headers: {
            Accept: 'application/json',
          },
        })
        .pipe(
          catchError((error: any) => {
            throw new BadRequestException(error);
          }),
        ),
    );
    return this.removeAllNonUSDTCoins(data.result.data);
  }

  /**
   *
   * @param apiData full data gotten from the api
   */
  removeAllNonUSDTCoins = (apiData: any) => {
    const usdtTickers = apiData.filter((ticker: { i: string }) =>
      ticker.i.endsWith('USDT'),
    );

    usdtTickers.forEach((obj) => {
      obj.i = obj.i.replace('-USDT', '');
    });

    return this._getCoinPrices(usdtTickers);
  };

  private _getCoinPrices(useFulldata) {
    let prices = []

    useFulldata.map((coins) => {
      prices.push(
        {
          coin: coins.i,
          price: coins.a,
          volume: coins.vv,
          askPrice: coins.k,
          bidPrice: coins.b,
        }
      )

    });
    return prices

    // useFulldata.map((coins) => {
    //   exchangeList.map((res) => {
    //     if (res.name === 'Gate.io') {
    //       res.info.push({
    //         coin: coins.i,
    //         price: coins.a,
    //         volume: coins.vv,
    //         askPrice: coins.k,
    //         bidPrice: coins.b,
    //       });
    //     }
    //   });
    // });
  }
}
