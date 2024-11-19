import { BadRequestException } from '@nestjs/common';
import { ApiServices } from 'src/helpers/apiConnectors/apis';
import { exchangeList } from 'src/helpers/general/remusdt';

export class PoloniexService {
  constructor(private api: ApiServices) {}

  async getCoinData() {
    let data: any;
    try {
      data = await this.api.poloniexClient.getTicker();
      this.removeAllNonUSDTCoins(data);
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

    this._getCoinPrices(usdtTickers);
  };

  private _getCoinPrices(useFulldata) {
    useFulldata.map((coins) => {
      exchangeList.map((res) => {
        if (res.name === 'OKX') {
          res.info.push({
            coin: coins.symbol,
            price: coins.markPrice,
            volume: coins.amount,
            askPrice: coins.ask,
            bidPrice: coins.bid,
          });
        }
      });
    });
  }
}
