import { BadRequestException, Injectable } from '@nestjs/common';
import { BitgetService } from './bitget.service';
import { HuobiService } from './huobi.service';
import { MexcService } from './mexc.service';
import { BybitService } from './bybit.service';



@Injectable()
export class CoinInfoService {
    /**
  * {
coin: '{coin_sell: BORING, exchange_sell: gateio, coin_buy: BORING, exchange_buy: mexc}'
}
  */
    constructor(
        private bitGetService: BitgetService,
        private huobiService: HuobiService,
        private mexcService: MexcService,
        private bybitService: BybitService
    ) { }

    async HandleGetCoinInfo(params: any) {
        const coin = JSON.parse(params.coin);
        const result = {
            exchange_sell: await this.doGetDetails(coin.exchange_sell, coin.coin_sell),
            exchange_buy: await this.doGetDetails(coin.exchange_buy, coin.coin_buy)
        }
        console.log(result)
        return result
    }

    private async doGetDetails(exchange: string, coin: string) {

        switch (exchange) {
            case 'bitget':
                return await this.bitGetService.checkExchangeStatus(coin)
                break;
            case 'huobi':
                return await this.huobiService.checkExchangeStatus(coin)
                break;
            case 'mexc': 
                return await this.mexcService.checkExchangeStatus(coin)
                break;
            case 'bybit':
                return await this.bybitService.checkExchangeStatus(coin)
                break;
            default:
                return 'exchange not found'
        }
    }


    private arrangeCoinTONetworks() {

    }

}
