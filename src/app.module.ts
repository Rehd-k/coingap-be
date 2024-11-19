import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsModule } from './transactions/transactions.module';
import { MarketsModule } from './markets/markets.module';
import { ConfigModule } from '@nestjs/config';
import { ExchangeModule } from './exchange/exchange.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot('mongodb://localhost/nest'),
    TransactionsModule,
    MarketsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ExchangeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
