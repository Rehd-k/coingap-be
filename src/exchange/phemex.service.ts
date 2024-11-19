import { HttpService } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { ApiServices } from 'src/helpers/apiConnectors/apis';
import { exchangeList } from 'src/helpers/general/remusdt';

export class PhemexClient {
  constructor(
    private httpService: HttpService,
    private api: ApiServices,
  ) {}

  async getCoins() {
    const { data } = await firstValueFrom(
      this.httpService
        .get('https://api.phemex.commd/spot/ticker/24hr/all', {
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
    this.removeAllNonUSDTCoins(data.result);
  }

  /**
   *
   * @param apiData full data gotten from the api
   */
  removeAllNonUSDTCoins = (apiData: any) => {
    const usdtTickers = apiData.filter((ticker: { symbol: string }) =>
      ticker.symbol.endsWith('USDT'),
    );

    usdtTickers.forEach((obj) => {
      obj.symbol = obj.symbol.replace('USDT', '');
    });

    this._getCoinPrices(usdtTickers);
  };

  private _getCoinPrices(useFulldata) {
    useFulldata.map((coins) => {
      exchangeList.map((res) => {
        if (res.name === 'Phemex') {
          res.info.push({
            coin: coins.symbol,
            price: coins.lastEp,
            volume: coins.turnoverEv,
            askPrice: coins.askEp,
            bidPrice: coins.bidEp,
          });
        }
      });
    });
  }
}
