import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ApiServices } from 'src/helpers/apiConnectors/apis';
import {
  removeAllNonUSDTCoins,
} from 'src/helpers/general/remusdt';
import * as fs from 'fs';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class BybitService {
  constructor(private api: ApiServices, private httpService: HttpService,) { }
  logger = Logger
  async getCoinData() {
   
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`https://api.bybit.com/v5/market/tickers?category=spot`, {
          maxContentLength: Infinity,
          headers: {
            'X-BAPI-SIGN': process.env.bybit_secret_key,
            'X-BAPI-API-KEY': process.env.bybit_key,
            'X-BAPI-TIMESTAMP': Date.now(),
            'X-BAPI-RECV-WINDOW': 5000,
            Accept: 'application/json'
          },
        })
      )
      const usefulldata = removeAllNonUSDTCoins(data.result.list);
      return this._getCoinPrices(usefulldata);
    } catch (err) {
      return err
      // throw new BadRequestException(err);
    }
  }

  private _getCoinPrices(useFulldata) {
    let prices = []

    useFulldata.map((coins) => {
      prices.push(
        {
          coin: coins.symbol,
          price: coins.lastPrice,
          volume: coins.turnover24h,
          askPrice: coins.ask1Price,
          bidPrice: coins.bid1Price,
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
        this.httpService.get(`https://api.bybit.com/v5/asset/coin/query-info?coin=${coin}`, {
          maxContentLength: Infinity,
          headers: {
            'X-BAPI-SIGN': process.env.bybit_secret_key,
            'X-BAPI-API-KEY': process.env.bybit_key,
            'X-BAPI-TIMESTAMP': Date.now(),
            'X-BAPI-RECV-WINDOW': 5000,
            Accept: 'application/json'
          },
        }).pipe(
          catchError((error: any) => {
            throw new BadRequestException(error);
          }),
        ),
      );
      if (data.retMsg !== 'success') {
        throw data
      }
      // console.log(data)
      return this.arrengesData(data.result)
    } catch (err) {
      return err
    }
  }

  private arrengesData(data) {
    const mod_data = []
    for (const i of data[0].rows) {
      const res = {
        chain: i.baseChainProtocol ? i.baseChainProtocol : i.chain,
        tags: i.addrDepositTag ? i.addrDepositTag : 'Unknown', // check back later to know if it exists
        withdrawable: i.chainDeposit === '1' ? true : false,
        rechargeable: i.chainWithdraw === '1' ? true : false,
        withdrawFee: i.withdrawFee,
        congestion: 'Unknown',
        extraWithdrawFee: i.withdrawPercentageFee ? i.withdrawPercentageFee : 0,
        depositConfirm: i.confirmation,
        withdrawConfirm: i.confirmation,
        minDepositAmount: i.depositMin,
        minWithdrawAmount: i.withdrawMin
      }
      mod_data.push(res)
    }
    return mod_data
  }
}
