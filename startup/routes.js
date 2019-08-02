const express = require("express");
const users = require("../router/users");
const tasks = require("../router/tasks");
const error = require("../middleware/error");

module.exports = function(app) {
  app.use(express.json());
  app.use("/users", users);
  app.use("/tasks", tasks);
  app.use(error);
};
