
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    constructor(private readonly logger: PinoLogger) {}
  
    use(req: Request, res: Response, next: NextFunction): void {
      const { method, originalUrl, path } = req;
      this.logger.info(`Incoming Request: ${method} ${originalUrl} ${path}`);
      next();
    }
  }
