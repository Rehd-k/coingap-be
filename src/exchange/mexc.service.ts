import { BadRequestException, Injectable } from '@nestjs/common';
import { ApiServices } from 'src/helpers/apiConnectors/apis';

@Injectable()
export class MexcService {
  constructor(private api: ApiServices) {}

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
    const usdtTickers = apiData.filter((ticker: { symbol: string }) =>
      ticker.symbol.endsWith('USDT'),
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

    // useFulldata.map((coins) => {
    //   exchangeList.map((res) => {
    //     if (res.name === 'MEXC') {
    //       res.info.push({
    //         coin: coins.symbol,
    //         price: coins.lastPrice,
    //         volume: coins.quoteVolume,
    //         askPrice: coins.askPrice,
    //         bidPrice: coins.bidPrice,
    //       });
    //     }
    //   });
    // });
  }
}
