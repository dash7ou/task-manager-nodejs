const crypto = require("crypto");

const helpers = {};

helpers.hashPassword = function(pass) {
  const hashIt = crypto
    .createHmac("sha256", "thisishashnoone")
    .update(pass)
    .digest("hex");

  return hashIt;
};

module.exports = helpers;
