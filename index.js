const express = require("express");
const app = express();
const mongoose = require("mongoose");
const users = require("./router/users");
const tasks = require("./router/tasks");
// const Joi = require("joi");
// Joi.objectId = require("joi-objectid")(Joi);
const error = require("./middleware/error");
const winston = require("winston");
require("winston-mongodb");

const port = process.env.PORT;

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

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true
  })
  .then(_ => console.log(`connect to mongodb...`))
  .catch(err => console.log("Mongo connection error", err));
mongoose.set("useCreateIndex", true);

app.use(express.json());
app.use("/users", users);
app.use("/tasks", tasks);
app.use(error);

app.listen(port, () => {
  console.log(`Server startup in port ${port}`);
});

// const { Task } = require("./model/task");
// const { User } = require("./model/user");

// const main = async () => {
//   const task = await Task.findById("5d401624cbdb6d1f523607d7");
//   await task.populate("owner").execPopulate();
//   console.log(task.owner);

//   const user = await User.findById("5d401596cbdb6d1f523607d5");
//   await user.populate("userTasks").execPopulate();

//   console.log(user.userTasks);
// };

// main();

// const multer = require("multer");

// const upload = multer({
//   dest: "images",
//   limits: {
//     fileSize: 1000000
//   },
//   fileFilter(req, file, cb) {
//     const reg = /\.(doc|docx)$/;
//     if (!file.originalname.match(reg)) {
//       return cb(new Error("please upload a word document"));
//     }
//     cb(undefined, true);
//   }
// });

// app.post("/upload", upload.single("upload"), (req, res) => {
//   res.send();
// }),
//   (error, req, res, next) => {
//     res.status(400).send({ error: error.message });
//   };
