const mongoose = require("mongoose");
const winston = require("winston");

module.exports = function() {
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useCreateIndex: true
    })
    .then(_ => winston.info(`connect to ${process.env.MONGODB_URL}`));
};
