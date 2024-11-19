import { Injectable } from '@nestjs/common';
import { MainClient } from 'binance';
import { RestClientV5 } from 'bybit-api';
import { RestClient } from 'okx-api';
import { RestClientV2 } from 'bitget-api';
import { SpotClient } from 'kucoin-api';
import { RestClient as RestClientGate } from 'gateio-api';
import { CoinbasePro } from 'coinbase-pro-node';
import { HuobiSDK } from 'node-huobi-sdk';
import { BFX } from 'bitfinex-api-node';
import * as Mexc from 'mexc-api-sdk';
import Poloniex from 'poloniex-api-node';

@Injectable()
export class ApiServices {
  constructor() {}
  binanceClient = new MainClient({
    api_key: process.env.binance_api_key,
    api_secret: process.env.binance_secret_key,
  });

  byBitClient = new RestClientV5({
    key: process.env.bybit_key,
    secret: process.env.bybit_secret_key,
    testnet: false,
  });

  okxClient = new RestClient({
    apiKey: process.env.okx_api_key,
    apiSecret: process.env.okx_secret_key,
    apiPass: process.env.okx_passPhrase,
  });

  krakenClient = '';

  bitgetClient = new RestClientV2({
    apiKey: '',
    apiSecret: '',
    apiPass: '',
  });

  kucoinClient = new SpotClient({
    apiKey: '',
    apiSecret: '',
    apiPassphrase: '',
  });

  gateioClient = new RestClientGate({
    apiKey: '',
    apiSecret: '',
  });

  bitstampClient = '';

  coinbaseproClient = new CoinbasePro({
    apiKey: '',
    apiSecret: '',
    passphrase: '',
    // The Sandbox is for testing only and offers a subset of the products/assets:
    // https://docs.cloud.coinbase.com/exchange/docs#sandbox
    useSandbox: true,
  });

  huobiClient = new HuobiSDK({
    accessKey: '',
    secretKey: '',
  });

  // Uninstall the bft package and just use API
  bfxClient = new BFX({ apiKey: '', apiSecret: '' });

  cryptodotcomClient = 'https://api.crypto.com/exchange/v1/{method}';

  phemexClient = 'https://vapi.phemex.com, https://api.phemex.com';

  mexcClient = new Mexc.Spot('apiKey', 'apiSecret');

  poloniexClient = new Poloniex({ apiKey: 'myKey', apiSecret: 'mySecret' });
}
