import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  getAllUsers() {
    return this.userModel.find();
  }

  async getUserById(id: string) {
    const isValid = mongoose.isValidObjectId(id);
    if (!isValid) {
      throw new BadRequestException('Please enter correcet Id');
    }
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  getUserByEmail(email: string) {
    return this.userModel.findOne({
      email,
    });
  }

  getUserByUsername(username: string) {
    return this.userModel.findOne({ username });
  }

  createNewUser(userData: any) {
    return this.userModel.create(userData);
  }

  async updateUser(id: string, updateData: any) {
    const user = await this.userModel.findById(id);
    for (const key in updateData) {
      if (user.hasOwnProperty(key)) {
        user[key] = updateData[key];
      }
    }
    await user.save();
    return user;
  }

  deleteUserById(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
