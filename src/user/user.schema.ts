import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Trade } from 'src/transactions/transactions.schema';

export type CatDocument = HydratedDocument<User>;

class ApiKey {
  exchnage: string;
  api_key: string;
  secret_key: string;
}

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trade' }] })
  trades: Trade[];

  @Prop([ApiKey])
  keys: ApiKey[];
}

export const UserSchema = SchemaFactory.createForClass(User);
