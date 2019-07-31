const mongoose = require("mongoose");
const Joi = require("joi");

const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    owner: {
      ref: "users",
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  },
  {
    timestamps: true
  }
);

function validateTask(task) {
  const Schema = {
    description: Joi.string().required(),
    completed: Joi.boolean()
  };
  return Joi.validate(task, Schema);
}

const Task = mongoose.model("tasks", taskSchema);

exports.validateTask = validateTask;
exports.Task = Task;
