import { Controller, Get } from '@nestjs/common';
import { ExchangeService } from 'src/exchange/exchange.service';

@Controller('markets')
export class MarketsController {
    constructor(private exchangeService: ExchangeService) { }

    @Get()
    async getAllPrices() {
        return this.exchangeService.getChangesList();
    }

}
