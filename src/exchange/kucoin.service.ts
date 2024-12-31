import { BadRequestException, Injectable } from '@nestjs/common';
import { ApiServices } from 'src/helpers/apiConnectors/apis';

@Injectable()
export class kucoinService {
  constructor(private api: ApiServices) {}

  async getCoinData() {
    let data: any;
    try {
      data = await this.api.kucoinClient.getTickers();
      const usefulldata = this.removeAllNonUSDTCoins(data.data.ticker);
      
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
    const usdtTickers = apiData.filter((ticker: { symbol: string }) =>
      ticker.symbol.endsWith('USDT'),
    );
  
    usdtTickers.forEach((obj) => {
      obj.symbol = obj.symbol.replace('-USDT', '');
    });
  
    return usdtTickers;
  };

  private _getCoinPrices(useFulldata) {

    let prices = []

    useFulldata.map((coins) => {
      prices.push(
        {
          coin: coins.symbol,
          price: coins.last,
          volume: coins.volValue,
          askPrice: coins.bestAskSize,
          bidPrice: coins.bestBidSize,
        }
      )

    });
    return prices


    // useFulldata.map((coins) => {
    //   exchangeList.forEach((res) => {
    //     if (res.name === 'Bitget') {
    //       res.info.push({
    //         coin: coins.symbol,
    //         price: coins.lastPrice,
    //         volume: coins.turnover24h,
    //         askPrice: coins.ask1Price,
    //         bidPrice: coins.bid1Price,
    //       });
    //     }
    //   });
    //   console.log(JSON.stringify(exchangeList));
    // });

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
