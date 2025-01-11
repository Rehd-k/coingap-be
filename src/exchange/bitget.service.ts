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

  /**
   * @function checks if that coin is withdrawal able by user and check fee and other things 
   */
  async checkExchangeStatus(coin: string) {
    try {
      const data = await this.api.bitgetClient.getSpotCoinInfo({ coin });
      return this.arrengesData(data.data)
    } catch (err) {
      console.log(err)
    }
  }

  private arrengesData(data) {
    const mod_data = []
    for (const i of data[0].chains) {
      const res = {
        chain: i.chain,
        tags: i.needTag,
        withdrawable: i.withdrawable === 'true' ? true : false,
        rechargeable: i.rechargeable === 'true' ? true : false,
        withdrawFee: i.withdrawFee,
        congestion: i.congestion,
        extraWithdrawFee: i.extraWithdrawFee,
        depositConfirm: i.depositConfirm,
        withdrawConfirm: i.withdrawConfirm,
        minDepositAmount: i.minDepositAmount,
        minWithdrawAmount: i.minWithdrawAmount
      }
      mod_data.push(res)
    }
    return mod_data
  }



  /**
   * @function Checks if the trade is worth it
   * @returns Number expected profit
   */

  checkEstimatedProfit(): Number {
    // check send to buy_from exchange gas fee (if applicable)
    // check send to sell_at exchnage gas fee
    // check send back to base if applicable
    // add all that and less from calculated difference 
    return 0
  };


  // check if worth it (still figuring that out)
  // check if withdrawable in both exchanges buy_from and sell_at
  // if buy_from is not base exchange withdraw from base exchange to buy_from exchange trading account 
  // do spot market swap 
  // send to sell_at exchange and do spot market swap to usdt if base exchange is not sell_at exchange send to base exchange
}
