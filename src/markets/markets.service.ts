import { BadRequestException, Injectable } from '@nestjs/common';

import * as fs from 'fs';

@Injectable()
export class MarketsService {
  constructor() {}

  getPricesForExchange(exchange) {
    // const okx = 'okx_ticker.json';
    // const bybit = 'bybit_ticker.json';
    try {
      /**
       * step one get all api data
       * remove all non USDT data
       * make all of them have the "-" between two coins
       * make them coin pair proparty value an array
       * check each for each new coin met and then check all the arrays for a prices of the coin then extract the height price and the lowerst for that coin
       * an array would hold objects which would hold {coin , highest_price, lowest_price, height_price_exchange, lowest_price_exchange, height_price_volume, lowest_price_volume, height_price_isWithdrwable, lowest_price_isWithdrawable,  }
       */
      const exchange_data = fs.readFileSync(`src/markets/${exchange}`, 'utf8');
      const okx_parsed = JSON.parse(exchange_data);
      return okx_parsed;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
