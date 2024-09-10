import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trade } from './transactions.schema';
import { getData } from 'src/helpers/gethelper';

@Injectable()
export class TransactionsService {
  constructor(@InjectModel(Trade.name) private tradeModel: Model<Trade>) {}
  //CRUD
  async createTrade(newTransaction) {
    try {
      const transaction = await this.tradeModel.create(newTransaction);
      return transaction;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async readTrades(query: any) {
    const { filter = {}, projection = null, options = {} } = query;
    try {
      await getData(this.tradeModel, filter, projection, options);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async readTradeById(id: string) {
    try {
      await this.tradeModel.findById(id);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async updateTrade(id: string, updateData: any) {
    let step = 0;
    try {
      const user = await this.tradeModel.findById(id);
      step = 1;
      for (const key in updateData) {
        if (user.hasOwnProperty(key)) {
          user[key] = updateData[key];
        }
      }
      await user.save();
      return user;
    } catch (err) {
      if (step < 1) {
        throw new NotFoundException(err);
      } else {
        throw new BadRequestException(err);
      }
    }
  }

  deleteTradeById(id: string) {
    return this.tradeModel.findByIdAndDelete(id);
  }
}
