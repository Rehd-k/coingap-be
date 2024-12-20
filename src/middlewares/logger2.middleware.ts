// import { Injectable, LoggerService } from '@nestjs/common';
// import * as pino from 'pino';
// import * as pinoCaller from 'pino-caller';

// @Injectable()
// export class PinoLoggerService implements LoggerService {
//   private logger = pinoCaller(
//     pino({
//       transport: {
//         target: 'pino-pretty',
//         options: {
//           colorize: true,
//           levelFirst: true,
//           translateTime: 'SYS:standard',
//         },
//       },
//     })
//   );

//   log(message: string, context?: string) {
//     this.logger.info({ context }, message);
//   }

//   error(message: string, trace?: string, context?: string) {
//     this.logger.error({ context, trace }, message);
//   }

//   warn(message: string, context?: string) {
//     this.logger.warn({ context }, message);
//   }
// }
