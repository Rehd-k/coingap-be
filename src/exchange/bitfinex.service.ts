import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { ApiServices } from 'src/helpers/apiConnectors/apis';

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
    return this.removeAllNonUSDTCoins(data);
  }

  removeAllNonUSDTCoins = (apiData: any) => {
    const regex = /USD[a-zA-Z]?$/;
    const usdtTickers = apiData.filter((ticker: any) =>
      ticker[0].endsWith('USD'),
      // regex.test(ticker[0])
    );

    usdtTickers.forEach((obj) => {
      obj[0] = obj[0].replace('USDT', '');
    });
    const filteredArray = usdtTickers.filter(
      (item) => !(typeof item[0] === "string" && item[0].includes("TEST"))
    );

    filteredArray.forEach((obj) => {
      obj[0] = obj[0].replace('t', '');
    });

    return this._getCoinPrices(filteredArray);
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
    });
    return priceses
  }
}
