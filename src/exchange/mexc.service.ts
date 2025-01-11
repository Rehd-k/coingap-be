import { BadRequestException, Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ApiServices } from 'src/helpers/apiConnectors/apis';

@Injectable()
export class MexcService {
  constructor(private api: ApiServices, private HttpService: HttpService) { }

  async getCoinData() {
    let data: any;
    try {
      data = await this.api.mexcClient.ticker24hr();
      return this.removeAllNonUSDTCoins(data);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   *
   * @param apiData full data gotten from the api
   */
  removeAllNonUSDTCoins = (apiData: any) => {
    const regex = /USD[a-zA-Z]?$/;
    const usdtTickers = apiData.filter((ticker: { symbol: string }) =>
      ticker.symbol.endsWith('USDT')
      // regex.test(ticker.symbol)
    );

    usdtTickers.forEach((obj) => {
      obj.symbol = obj.symbol.replace('USDT', '');
    });

    return this._getCoinPrices(usdtTickers);
  };

  private _getCoinPrices(useFulldata) {

    let prices = []

    useFulldata.map((coins) => {
      prices.push(
        {
          coin: coins.symbol,
          price: coins.lastPrice,
          volume: coins.quoteVolume,
          askPrice: coins.askPrice,
          bidPrice: coins.bidPrice,
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
        this.HttpService.get(`https://api.mexc.com/api/v3/capital/config/getall`, {
          maxContentLength: Infinity,
          headers: {
            'X-MEXC-APIKEY': process.env.mexc_api_key ? process.env.mexc_api_key : 'qwertyuiopasdfghjk',
            'X-MEXC-APISIGN': process.env.mexc_secret_key ? process.env.mexc_secret_key : 'qwertyuiopasdfghjkl',
            Accept: 'application/json',
          },
        })
      );
      return this.arrengesData(data.data)
    } catch (err) {
      if (err.response) {
        return err.response.data
      } if (err.message) {
        return {
          "code": 440,
          "msg": err.message
        }
      }
      throw new BadRequestException(err)
    }

  }


  private arrengesData(data) {
    const mod_data = []
    for (const i of data[0].networkList) {
      const res = {
        chain: i.network,
        tags: i.depositTips !== null ? true : false,
        withdrawable: i.withdrawEnable,
        rechargeable: i.depositEnable,
        withdrawFee: i.withdrawFee,
        congestion: 'Unknown',
        extraWithdrawFee: i.extraWithdrawFee ? i.extraWithdrawFee : 0,
        depositConfirm: i.minConfirm,
        withdrawConfirm: i.minConfirm,
        minDepositAmount: i.depositMin ? i.depositMin : 0,
        minWithdrawAmount: i.withdrawMin
      }
      mod_data.push(res)
    }
    return mod_data
  }
}

