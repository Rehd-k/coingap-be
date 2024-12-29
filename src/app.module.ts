import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsModule } from './transactions/transactions.module';
import { MarketsModule } from './markets/markets.module';
import { ConfigModule } from '@nestjs/config';
import { ExchangeModule } from './exchange/exchange.module';
import { LoggerModule } from 'nestjs-pino';
import { LoggingMiddleware } from './middlewares/logger.middleware';
import 'pino-pretty'

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot("mongodb+srv://Rehdd-k:VTCF6myA9ltnJ6Rx@cryptoknight.2rshc.mongodb.net/goziebank?retryWrites=true&w=majority"),
    TransactionsModule,
    MarketsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ExchangeModule,
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'info', // Set log level
        transport: process.env.NODE_ENV !== 'production' ? {
          target: 'pino-pretty',
          options: {
            
            colorize: true,
            translateTime: 'HH:MM:ss',
          },
        } : undefined, // Pretty logs in development
      },
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
