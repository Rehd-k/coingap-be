/**
 *
 * @param apiData full data gotten from the api if the coin holder is called symbol
 */
export const removeAllNonUSDTCoins = (apiData: any) => {
  const regex = /USD[a-zA-Z]?$/;
  const usdtTickers = apiData.filter((ticker: { symbol: string }) =>
    // regex.test(ticker.symbol)
  ticker.symbol.endsWith('USDT'),
  );

  usdtTickers.forEach((obj) => {
    obj.symbol = obj.symbol.replace('USDT', '');
  });

  return usdtTickers;
};

type CoinsType = {
  name: string;
  info?: {
    coin: string;
    price: number;
    volume: number;
    askPrice: number;
    bidPrice: number;
  }[];
};

// [
        //   {
        //     name: 'BTC',
        //     info: [
        //       ,
        //       {
        //         vol: 0,
        //         ask: 0,
        //         bid: 0,
        //         exchange: 'OKx'
        //       },
        //       ,
        //       {
        //         vol: 0,
        //         ask: 0,
        //         bid: 0,
        //         exchange: 'bybit'
        //       }
        //     ]
        //   },
        //   {
        //     name: 'BTC',
        //     info: [
        //       {
        //         vol: 0,
        //         ask: 0,
        //         bid: 0,
        //         exchange: 'ByBit'
        //       },
        //       {
        //         vol: 0,
        //         ask: 0,
        //         bid: 0,
        //         exchange: 'OKx'
        //       }
        //     ]
        //   }

        // ]