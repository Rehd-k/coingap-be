import { Controller, Get, Param, Query } from '@nestjs/common';
import { CoinInfoService } from 'src/exchange/coininfo.service';
import { ExchangeService } from 'src/exchange/exchange.service';

@Controller('markets')
export class MarketsController {
    constructor(private exchangeService: ExchangeService, private coinInfoService : CoinInfoService) { }

    @Get()
    async getAllPrices() {
        return this.exchangeService.getChangesList();
    }

    @Get('/coininfo')
    async getCoinInfo(
        @Query() coinInfo : any
    ) {
        return this.coinInfoService.HandleGetCoinInfo(coinInfo)
    }

}
