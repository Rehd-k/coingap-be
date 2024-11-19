import { BadRequestException, Injectable } from '@nestjs/common';
import { ApiServices } from 'src/helpers/apiConnectors/apis';
import { exchangeList } from 'src/helpers/general/remusdt';

@Injectable()
export class HuobiService {
  constructor(private api: ApiServices) {}
  async getCoinData() {
    let data: any;
    try {
      data = await this.api.huobiClient.getTickers();
      const usefulldata = this.removeAllNonUSDTCoins(data.data);
      this._getCoinPrices(usefulldata);
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
      obj.symbol = obj.symbol.replace('_USDT', '');
    });

    return usdtTickers;
  };

  private _getCoinPrices(useFulldata) {
    useFulldata.map((coins) => {
      exchangeList.map((res) => {
        if (res.name === 'Gate.io') {
          res.info.push({
            coin: coins.symbol,
            price: coins.last,
            volume: coins.vol,
            askPrice: coins.ask,
            bidPrice: coins.bid,
          });
        }
      });
    });
  }
}
