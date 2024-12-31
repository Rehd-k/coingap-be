import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { firstValueFrom, catchError } from 'rxjs';

@Injectable()
export class ExmoService {
    constructor(private httpService: HttpService) { }

    async getTicker(): Promise<any> {
        try {
            const { data } = await firstValueFrom(
                this.httpService
                    .get('https://api.exmo.com/v1.1/ticker', {
                        maxContentLength: Infinity,
                        headers: {
                            Accept: 'application/json',
                        },
                    })
                    .pipe(
                        catchError((error: any) => {
                            throw new BadRequestException(error);
                        }),
                    ),
            );
            return this.removeAllNonUSDTCoins(data)
        } catch (error) {
            console.error('Error fetching ticker data:', error);
            return null;
        }
    }

    /**
     *
     * @param apiData full data gotten from the api
     */
    // Matches keys ending with 'USD'


    removeAllNonUSDTCoins(data) {
        const regex = /USD[a-zA-Z]?$/; // Matches keys ending with 'USD'
        const transformedData = Object.keys(data)
            .filter(key => regex.test(key)) // Filter keys that match the regex
            .map(key => {
                const symbol = key.replace('_USD', '/USD'); // Replace '_USD' with '/USD'
                const coin = data[key];
                return {
                    coin: symbol,
                    price: coin.last_trade,
                    volume: coin.vol_curr,
                    askPrice: coin.sell_price,
                    bidPrice: coin.buy_price
                };
            });
        return transformedData
    }
}
