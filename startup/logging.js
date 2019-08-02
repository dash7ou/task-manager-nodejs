const winston = require("winston");
require("winston-mongodb");

module.exports = function() {
  //handle error in file .log
  winston.add(winston.transports.File, { filename: "logfile.log" });

  //handle error in db
  winston.add(winston.transports.MongoDB, {
    db: process.env.MONGODB_URL,
    level: "info"
  });

  winston.handleExceptions(
    new winston.transports.File({ filename: "uncaughtException.log" })
  );

  //handle un handled rejection
  process.on("unhandledRejection", err => {
    throw err;
  });
};
