import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { ApiServices } from 'src/helpers/apiConnectors/apis';
import { exchangeList } from 'src/helpers/general/remusdt';

@Injectable()
export class BitfinexService {
  constructor(
    private httpService: HttpService,
  ) { }

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
    return this.removeAllNonUSDTCoins(data);
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

    return this._getCoinPrices(usdtTickers);
  };

  private _getCoinPrices(useFulldata) {
    let priceses = [];
    useFulldata.map((coins) => {
      priceses.push({
        coin: coins[0],
        price: coins[7],
        volume: coins[8],
        askPrice: coins[3],
        bidPrice: coins[1],
      })
      // exchangeList.map((res) => {
      //   if (res.name === 'Bitfinex') {
      //     res.info.push({
      //       coin: coins[0],
      //       price: coins[7],
      //       volume: coins[8],
      //       askPrice: coins[3],
      //       bidPrice: coins[1],
      //     });
      //   }
      // });
    });
    return priceses
  }
}
