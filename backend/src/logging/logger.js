import winston from 'winston';
winston.addColors({
  error: 'bold red',
  warn: 'yellow',
  info: 'green',
  verbose: 'dim white',
  debug: 'gray',
  silly: 'magenta'
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message} ${info.meta ? info.meta : ''}`)
  ),
  transports: [
    new winston.transports.File({
      level: 'error',
      filename: 'logging/logs/error.log',
    }),
    new winston.transports.File({
      filename: 'logging/logs/combined.log',
    }),
    new winston.transports.Console({})
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logging/logs/exceptions.log' }),
  ],
});

export default logger;
