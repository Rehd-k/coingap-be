import { BadRequestException, Injectable } from '@nestjs/common';
import { ApiServices } from 'src/helpers/apiConnectors/apis';

@Injectable()
export class OkxService {
  constructor(private api: ApiServices) { }

  async getCoinData() {
    let data: any;
    try {
      data = await this.api.okxClient.getTickers('SPOT');
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
  removeAllNonUSDTCoins(apiData: any) {
    const usdtTickers = apiData.filter((ticker: { instId: string }) =>
      ticker.instId.endsWith('USDT'),
    );



    usdtTickers.forEach((obj) => {
      obj.instId = obj.instId.replace('-USDT', '');
    });
    return usdtTickers;
  }

  private _getCoinPrices(useFulldata) {


    let prices = []

    useFulldata.map((coins) => {
      prices.push(
        {
          coin: coins.instId,
          price: coins.last,
          volume: coins.volCcy24h,
          askPrice: coins.askPx,
          bidPrice: coins.bidPx,
        }
      )

    });
    return prices


    // useFulldata.map((coins) => {
    //   exchangeList.map((res) => {
    //     if (res.name === 'OKX') {
    //       res.info.push({
    //         coin: coins.instId[0],
    //         price: coins.last,
    //         volume: coins.volCcy24h,
    //         askPrice: coins.askPx,
    //         bidPrice: coins.bidPx,
    //       });
    //     }
    //   });
    // });
  }
}
