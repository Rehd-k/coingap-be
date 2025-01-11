import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class BitstampService {
  constructor(private httpService: HttpService) { }

  async getCoins() {
    const { data } = await firstValueFrom(
      this.httpService
        .get('https://www.bitstamp.net/api/v2/ticker/', {
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

  /**
   *
   * @param apiData full data gotten from the api
   */
  removeAllNonUSDTCoins = (apiData: any) => {
    const regex = /USD[a-zA-Z]?$/;
    const usdtTickers = apiData.filter((ticker: { pair: string }) =>
      ticker.pair.endsWith('USDT'),
      // regex.test(ticker.pair)
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
    });
    return prices
  }

  /**
   * @function checks if that coin is withdrawal able by user and check fee and other things 
   */
  async checkExchangeStatus(coin: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get('https://www.bitstamp.net/api/v2/currencies/', {
            maxContentLength: Infinity,
            headers: {
              Accept: 'application/json',
            },
          })
      )
      return this.arrengesData(data.data, coin)
    } catch (err) {
      return {
        code: 404,
        message: err.message
      }
    }
  }

  private arrengesData(data, coin: string) {
    const mod_data = []
    data.find(res => {
      if (res.currency.toLowerCase() === coin.toLowerCase())
        for (const i of data[0].networks) {
          const res = {
            chain: i.network,
            tags: 'Unknown',
            withdrawable: i.withdrawal === 'Enabled' ? true : false,
            rechargeable: i.deposit === 'Enabled' ? true : false,
            withdrawFee: i.withdrawal_minimum_amount,
            congestion: 'Unknown',
            extraWithdrawFee: 'Unknown',
            depositConfirm: 'Unknown',
            withdrawConfirm: 'Unknown',
            minDepositAmount: 'Unknown',
            minWithdrawAmount: 'Unknown'
          }
          mod_data.push(res)
        }
    })
    return mod_data
  }

}
