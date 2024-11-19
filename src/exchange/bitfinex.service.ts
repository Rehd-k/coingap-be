import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { ApiServices } from 'src/helpers/apiConnectors/apis';
import { exchangeList } from 'src/helpers/general/remusdt';

@Injectable()
export class BitfinexService {
  constructor(
    private api: ApiServices,
    private httpService: HttpService,
  ) {}

  async getCoins() {
    const { data } = await firstValueFrom(
      this.httpService
        .get('https://api-pub.bitfinex.com/v2/tickers?symbols=ALL', {
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
    console.log(JSON.stringify(data));
    this.removeAllNonUSDTCoins(data);
  }

  /**
   *
   * @param apiData full data gotten from the api
   */
  removeAllNonUSDTCoins = (apiData: any) => {
    const usdtTickers = apiData.filter((ticker: any) =>
      ticker[0].endsWith('USDT'),
    );

    usdtTickers.forEach((obj) => {
      obj.currency_pair = obj.currency_pair.replace('USDT', '');
    });

    this._getCoinPrices(usdtTickers);
  };

  private _getCoinPrices(useFulldata) {
    useFulldata.map((coins) => {
      exchangeList.map((res) => {
        if (res.name === 'Gate.io') {
          res.info.push({
            coin: coins[0],
            price: coins[7],
            volume: coins[8],
            askPrice: coins[3],
            bidPrice: coins[1],
          });
        }
      });
    });
  }
}
