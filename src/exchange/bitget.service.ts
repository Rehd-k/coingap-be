import { BadRequestException, Injectable } from '@nestjs/common';
import { ApiServices } from 'src/helpers/apiConnectors/apis';
import {
  exchangeList,
  removeAllNonUSDTCoins,
} from 'src/helpers/general/remusdt';

@Injectable()
export class BitgetService {
  constructor(private api: ApiServices) {}

  async getCoinData() {
    let data: any;
    try {
      data = await this.api.bitgetClient.getSpotTicker();
      const usefulldata = removeAllNonUSDTCoins(data.data);
      this._getCoinPrices(usefulldata);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  private _getCoinPrices(useFulldata) {
    useFulldata.map((coins) => {
      exchangeList.forEach((res) => {
        if (res.name === 'Bitget') {
          res.info.push({
            coin: coins.symbol,
            price: coins.lastPrice,
            volume: coins.turnover24h,
            askPrice: coins.ask1Price,
            bidPrice: coins.bid1Price,
          });
        }
      });
      console.log(JSON.stringify(exchangeList));
    });

    // fs.writeFile(
    //   'src/helpers/general/exchanges.ts',
    //   JSON.stringify(exchangeList),
    //   (err) => {
    //     if (err) {
    //       console.log('Error writing file', err);
    //     } else {
    //       console.log('Successfully wrote file');
    //     }
    //   },
    // );
  }
}
