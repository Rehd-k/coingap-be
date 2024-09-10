import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/user.schema';

export type TradeDocument = HydratedDocument<Trade>;

@Schema()
export class Trade {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop()
  boughtForm: string;

  @Prop()
  soldAt: number;

  @Prop()
  pair: string;

  @Prop()
  buyingPrice: number;

  @Prop()
  sellingPrice: number;

  @Prop()
  totalCharges: number;

  @Prop()
  grossProfit: number;

  @Prop()
  netProfit: number;

  @Prop()
  startAmount: number;

  @Prop()
  endAmount: number;
}

export const TradeSchema = SchemaFactory.createForClass(Trade);
