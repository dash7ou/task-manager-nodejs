const express = require("express");
const app = express();
const mongoose = require("mongoose");
const users = require("./router/users");
const tasks = require("./router/tasks");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const error = require("./middleware/error");

const port = process.env.PORT;

mongoose
  .connect(process.env.MONGODB_URL, {
    reconnectTries: 100,
    reconnectInterval: 500,
    autoReconnect: true,
    useNewUrlParser: true,
    dbName: "test"
  })
  .catch(err => console.log("Mongo connection error", err));

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
