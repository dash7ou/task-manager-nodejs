const mongoose = require("mongoose");
const Joi = require("joi");
const helpers = require("../lib/helpers");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Task } = require("./task");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
      trim: true
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
      trim: true,
      lowercase: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      trim: true,
      maxlength: 1024
    },
    age: {
      type: Number,
      default: 0
    },
    avatar: {
      type: Buffer
    }
  },
  {
    timestamps: true
  }
);

userSchema.virtual("userTasks", {
  ref: "tasks",
  localField: "_id",
  foreignField: "owner"
});

function validateUser(user) {
  const Schema = {
    name: Joi.string()
      .required()
      .min(5)
      .max(255),
    email: Joi.string()
      .required()
      .min(5)
      .max(225)
      .email(),
    password: Joi.string()
      .required()
      .min(5)
      .max(255)
  };

  return Joi.validate(user, Schema);
}

function validateUserUpdate(user) {
  const Schema = {
    name: Joi.string()
      .min(5)
      .max(255),
    email: Joi.string()
      .min(5)
      .max(225)
      .email(),
    password: Joi.string()
      .min(5)
      .max(255),
    age: Joi.string()
  };

  return Joi.validate(user, Schema);
}

userSchema.pre("save", async function(next) {
  const user = this;

  if (user.isModified("password")) {
    // user.password = helpers.hashPassword(user.password);
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

function validateLogin(user) {
  const Schema = {
    email: Joi.string()
      .required()
      .min(5)
      .max(225)
      .email(),
    password: Joi.string()
      .required()
      .min(5)
      .max(255)
  };
  return Joi.validate(user, Schema);
}

userSchema.statics.findByCredentials = async (email, pass) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Unable to login");

  const isMatch = await bcrypt.compare(pass, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

userSchema.methods.generateAuthToken = function() {
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_SECRET_CODE
  );
  return token;
};

userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.avatar;

  return userObject;
};

userSchema.pre("remove", async function(next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("users", userSchema);

exports.validateUser = validateUser;
exports.User = User;
exports.validateUserUpdate = validateUserUpdate;
exports.validateLogin = validateLogin;
