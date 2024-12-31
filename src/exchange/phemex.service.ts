// Suggested code may be subject to a license. Learn more: ~LicenseLog:393955637.
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PhemexService {
    constructor(private readonly httpService: HttpService) { }

    async getTicker(): Promise<any> {
        try {
            const url = `https://api.phemex.com/md/spot/ticker/24hr/all`;
            const { data } = await lastValueFrom(this.httpService.get(url));
            if (data.error) throw new BadRequestException(data.error);
            return this.removeAllNonUSDTCoins(data.result);
        } catch (err) {
            throw new BadRequestException(err)
        }

    }

    removeAllNonUSDTCoins = (apiData: any) => {
        const regex = /USD[a-zA-Z]?$/;
        const usdtTickers = apiData.filter((ticker: any) =>
            // ticker[0].endsWith('USD'),
            regex.test(ticker.symbol)
        );

        usdtTickers.forEach((obj) => {
            obj[0] = obj[0].replace('s', '');
        });

        usdtTickers.forEach((obj) => {
            obj.symbol = obj.symbol.replace('USD', '/USD');
        });
        return this._getCoinPrices(usdtTickers);
    };

    private _getCoinPrices(useFulldata) {
        let priceses = [];
        useFulldata.map((coins) => {
            priceses.push({
                coin: coins.symbol,
                price: coins[7],
                volume: coins[8],
                askPrice: coins[3],
                bidPrice: coins[1],
            })
            // exchangeList.map((res) => {
            //   if (res.name === 'Bitfinex') {
            //     res.info.push({
            //       coin: coins[0],
            //       price: coins[7],
            //       volume: coins[8],
            //       askPrice: coins[3],
            //       bidPrice: coins[1],
            //     });
            //   }
            // });
        });
        return priceses
    }
}
