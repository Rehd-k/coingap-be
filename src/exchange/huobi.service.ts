import { BadRequestException, Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ApiServices } from 'src/helpers/apiConnectors/apis';

@Injectable()
export class HuobiService {
  constructor(private api: ApiServices, private HttpService : HttpService) { }
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
  }


  /**
   * @function checks if that coin is withdrawal able by user and check fee and other things 
   */
  async checkExchangeStatus(coin: string) {
    try {
      const { data } = await firstValueFrom(
        this.HttpService.get(`https://api.huobi.pro/v2/reference/currencies?currency=${coin.toLocaleLowerCase()}`, {
          maxContentLength: Infinity,
          headers: {
            Accept: 'application/json',
          },
        }).pipe(
          catchError((error: any) => {
            throw new BadRequestException(error);
          }),
        ),
      );
      return this.arrengesData(data.data)
    } catch (err) {
      console.log(err)
    }
  }

  private arrengesData  (data) {
    const mod_data = []
    for (const i of data[0].chains) {
      const res = {
        chain : i.baseChainProtocol ? i.baseChainProtocol : i.chain,
        tags : i.addrDepositTag,
        withdrawable : i.withdrawStatus === 'allowed' ? true : false,
        rechargeable : i.depositStatus === 'allowed' ? true : false,
        withdrawFee: i.transactFeeWithdraw,
        congestion : data[0].instStatus,
        extraWithdrawFee: i.extraWithdrawFee ? i.extraWithdrawFee : 0,
        depositConfirm: i.numOfFastConfirmations ? `${i.numOfFastConfirmations} (FAST)`: i.numOfConfirmations,
        withdrawConfirm: i.numOfFastConfirmations ? `${i.numOfFastConfirmations} (FAST)`: i.numOfConfirmations,
        minDepositAmount : i.minDepositAmt,
        minWithdrawAmount : i.minWithdrawAmt      
      }
      mod_data.push(res)
    }
    return mod_data
  }
}
