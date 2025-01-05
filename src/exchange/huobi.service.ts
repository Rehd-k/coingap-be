import { BadRequestException, Injectable } from '@nestjs/common';
import { ApiServices } from 'src/helpers/apiConnectors/apis';

@Injectable()
export class HuobiService {
  constructor(private api: ApiServices) { }
  async getCoinData() {
    let data: any;
    try {
      data = await this.api.huobiClient.getTickers();

      const usefulldata = this.removeAllNonUSDTCoins(data);
      return this._getCoinPrices(usefulldata);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   *
   * @param apiData full data gotten from the api
   */
  removeAllNonUSDTCoins = (apiData: any) => {
    const regex = /usd[a-zA-Z]?$/;
    const usdtTickers = apiData.filter((ticker: { symbol: string }) =>
      ticker.symbol.endsWith('usdt')
      // regex.test(ticker.symbol)
    );

    usdtTickers.forEach((obj) => {
      obj.symbol = obj.symbol.replace('usdt', '');
      obj.symbol = obj.symbol.toUpperCase()
    });



    return usdtTickers;
  };

  private _getCoinPrices(useFulldata) {
    let prices = []

    useFulldata.map((coins) => {
      prices.push(
        {
          coin: coins.symbol,
          price: `${coins.close}`,
          volume: `${coins.vol}`,
          askPrice: `${coins.ask}`,
          bidPrice: `${coins.bid}`,
        }
      )

    });
    return prices

    // useFulldata.map((coins) => {
    //   exchangeList.map((res) => {
    //     if (res.name === 'Gate.io') {
    //       res.info.push({
    //         coin: coins.symbol,
    //         price: coins.last,
    //         volume: coins.vol,
    //         askPrice: coins.ask,
    //         bidPrice: coins.bid,
    //       });
    //     }
    //   });
    // });
  }
}
