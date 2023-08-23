const winston = require('winston');
exports.infoLogger = new winston.createLogger({
  transports: [
    new winston.transports.File({
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD hh:mm:ss A ZZ'
        }),
        winston.format.json()
      ),
      level: 'info',
      filename: './logs/info.log',
      json: true,
    }),
    new winston.transports.Console,
  ],
  
});

exports.errorLogger = new winston.createLogger({
  transports: [
    new winston.transports.File({
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD hh:mm:ss A ZZ'
        }),
        winston.format.json()
      ),
      level: 'error',
      filename: './logs/errors.log',
      json: true,
    }),
    new winston.transports.Console,
  ],
  
});


