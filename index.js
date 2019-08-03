const app = require("./startup/app.js");
const winston = require("winston");

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server startup in port ${port}`);
  winston.info(`Server startup in port ${port}`);
});
