const express = require("express");
const app = express();
const winston = require("winston");

require("./startup/routes")(app);
require("./startup/db")();
require("./startup/logging")();

const port = process.env.PORT;

//if you want to try error and winston delete commit error below
// throw new Error("Something failed during startup app :("); //solve that we use process.on

// const p = Promise.reject(new Error("something failed in application"));

app.listen(port, () => {
  console.log(`Server startup in port ${port}`);
  winston.info(`Server startup in port ${port}`);
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
