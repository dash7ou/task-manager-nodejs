const mongoose = require("mongoose");
const winston = require("winston");

module.exports = function() {
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true
    })
    .then(_ => console.log(`connect to mongodb...`))
    .then(_ => winston.info("connect to mongodb"));
  mongoose.set("useCreateIndex", true);
};
