/**
 *
 * @param apiData full data gotten from the api if the coin holder is called symbol
 */
export const removeAllNonUSDTCoins = (apiData: any) => {
  const usdtTickers = apiData.filter((ticker: { symbol: string }) =>
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
export let exchangeList: CoinsType[] = [];
export function handleExchanges(data) {
  exchangeList = data;
}
