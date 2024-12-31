import { BadRequestException, Injectable } from '@nestjs/common';
import { ApiServices } from 'src/helpers/apiConnectors/apis';

@Injectable()
export class GateioService {
  constructor(private api: ApiServices) { }
  async getCoinData() {
    let data: any;
    try {
      data = await this.api.gateioClient.getSpotTicker();
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
    const usdtTickers = apiData.filter((ticker: { currency_pair: string }) =>
      ticker.currency_pair.endsWith('USDT'),
    );

    usdtTickers.forEach((obj) => {
      obj.currency_pair = obj.currency_pair.replace('_USDT', '');
    });

    return usdtTickers;
  };

  private _getCoinPrices(useFulldata) {

    let prices = []

    useFulldata.map((coins) => {
      prices.push(
        {
          coin: coins.currency_pair,
          price: coins.last,
          volume: coins.quote_volume,
          askPrice: coins.lowest_ask,
          bidPrice: coins.highest_bid,
        }
      )

    });
    return prices


    // useFulldata.map((coins) => {
    //   exchangeList.map((res) => {
    //     if (res.name === 'Gate.io') {
    //       res.info.push({
    //         coin: coins.currency_pair,
    //         price: coins.last,
    //         volume: coins.quote_volume,
    //         askPrice: coins.lowest_ask,
    //         bidPrice: coins.highest_bid,
    //       });
    //     }
    //   });
    // });
  }
}
