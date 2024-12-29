import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { exchangeList } from 'src/helpers/general/remusdt';

@Injectable()
export class BitstampService {
  constructor(private httpService: HttpService) { }

  async getCoins() {
    const { data } = await firstValueFrom(
      this.httpService
        .get('https://api.kraken.com/0/public/Ticker', {
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
    return this._getCoinPrices(data);
  }

  /**
   *
   * @param apiData full data gotten from the api
   */
  removeAllNonUSDTCoins = (apiData: any) => {
    const usdtTickers = apiData.filter((ticker: { pair: string }) =>
      ticker.pair.endsWith('USDT'),
    );

    usdtTickers.forEach((obj) => {
      obj.pair = obj.pair.replace('/USDT', '');
    });

    return this._getCoinPrices(usdtTickers);
  };

  private _getCoinPrices(useFulldata) {
    let prices = []

    useFulldata.map((coins) => {
      prices.push(
        {
          coin: coins.pair,
          price: coins.last,
          volume: coins.volume,
          askPrice: coins.ask,
          bidPrice: coins.bid,
        }
      )
      // exchangeList.map((res) => {
      //   if (res.name === 'Gate.io') {
      //     res.info.push({
      //       coin: coins.pair,
      //       price: coins.last,
      //       volume: coins.volume,
      //       askPrice: coins.ask,
      //       bidPrice: coins.bid,
      //     });
      //   }
      // });
    });
    return prices
  }
}
