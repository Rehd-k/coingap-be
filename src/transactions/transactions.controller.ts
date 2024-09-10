import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private tradesService: TransactionsService) {}

  @Post()
  async createTrade(@Body() body: any) {
    await this.tradesService.createTrade(body);
  }

  @Get()
  async readTrade(@Query() query: any) {
    await this.tradesService.readTrades(query);
  }

  @Patch(':id')
  async updateTrade(@Param('id') id: string, @Body() body: any) {
    await this.tradesService.updateTrade(id, body);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.tradesService.deleteTradeById(id);
  }
}
