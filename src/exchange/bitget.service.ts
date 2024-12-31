import { BadRequestException, Injectable } from '@nestjs/common';
import { ApiServices } from 'src/helpers/apiConnectors/apis';
import {
  removeAllNonUSDTCoins,
} from 'src/helpers/general/remusdt';

@Injectable()
export class BitgetService {
  constructor(private api: ApiServices) { }

  async getCoinData() {
    let data: any;
    try {
      data = await this.api.bitgetClient.getSpotTicker();
      const usefulldata = removeAllNonUSDTCoins(data.data);
      return this._getCoinPrices(usefulldata);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  private _getCoinPrices(useFulldata) {
    const prices = []
    useFulldata.map((coins) => {
      prices.push({
        coin: coins.symbol,
        price: coins.lastPr,
        volume: coins.quoteVolume,
        askPrice: coins.askPr,
        bidPrice: coins.askPr,
      })     
    });
    return prices
  }
}
