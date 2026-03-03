import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'

export const WinstonLogger = WinstonModule.createLogger({
  transports: [

    // Console log
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),

    // Error log file
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),

    // All logs
    new winston.transports.File({
      filename: 'logs/app.log',
    }),

  ],
})