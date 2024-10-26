// winstonをインポート
const winston = require("winston");
// pathモジュールをインポート
const path = require("path"); 

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(__dirname, "logs", "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(__dirname, "logs", "app.log"),
    }),
  ],
});

module.exports = logger;
