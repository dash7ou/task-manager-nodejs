const express = require("express");
const app = express();

require("./routes")(app);
require("./db")();
require("./logging")();

module.exports = app;
