const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const { sendWelcomeEmail, sendDeleteEmail } = require("../emails/account");
const asyncMiddleware = require("../middleware/async");

const {
  validateLogin,
  validateUser,
  User,
  validateUserUpdate,
  findByCredentials
} = require("../model/user");

router.post("/", async (req, res, next) => {
  const { error } = validateUser(req.body);
  if (error) return res.send(error.details[0].message);

  const oldUser = await User.findOne({ email: req.body.email });
  // console.log(oldUser);
  if (oldUser) return res.status(400).send("This user already exist :p");

  const user = new User(req.body);

  try {
    await user.save();
    // console.log(user);
    const token = user.generateAuthToken();
    sendWelcomeEmail(user.email, user.name);
    res
      .header("x-auth-token", token)
      .status(201)
      .send(user);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  const error = validateLogin(req.body);
  if (!error) return res.status(400).send(error.details[0].message);

  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = user.generateAuthToken();
    res.header("x-auth-token", token).send(user);
  } catch (err) {
    next(err);
  }
});

router.get(
  "/me",
  auth,
  asyncMiddleware(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
  })
);

const upload = multer({
  // dest: "avatars",
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    const regx = /\.(jpg|jpeg|png)$/;

    if (!file.originalname.match(regx)) {
      return cb(new Error("Enter photo file please :P"));
    }

    cb(undefined, true);
  }
});

router.post("/me/avatar", auth, upload.single("avatar"), async (req, res) => {
  const user = await User.findById(req.user._id);
  user.avatar = req.file.buffer;
  await user.save();
  // console.log(user.avatar);
  res.status(200).send();
}),
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  };

router.delete(
  "/me/avatar",
  auth,
  asyncMiddleware(async (req, res) => {
    const user = await User.findById(req.user._id);
    // await user.deleteOne({});
    user.avatar = undefined;
    await user.save();
    res.send();
  })
);

router.get(
  "/:id/avatar",
  asyncMiddleware(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) res.status(400).send("no user with this id sorry");

    const avatar = user.avatar;
    if (!avatar) res.status(400).send("this user have not profile photo sorry");

    res.set("Content-Type", "image/jpg");
    res.status(200).send(avatar);
  })
);

// router.get("/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).send("Sorry not validate id ");

//     res.status(200).send(user);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

router.put("/me", auth, async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];

  const isValidate = updates.every(update => allowedUpdates.includes(update));

  if (isValidate === false)
    return res.status(400).send({
      error: "invalid operation!"
    });

  const { error } = validateUserUpdate(req.body);
  if (error) return res.status(400).send(error);

  // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
  //   new: true,
  //   runValidators: true
  // });
  try {
    const user = await User.findById(req.user._id);
    // if (!user) res.status(404).send("user you lookup about him not exist ");

    updates.forEach(update => (user[update] = req.body[update]));

    await user.save();
    res.send(user);
  } catch (err) {
    next(err);
  }
});

router.delete("/me", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    await user.remove();
    // if (!user)
    //   return res
    //     .status(404)
    //     .send("no fucking user with this id mother fucker :p");
    sendDeleteEmail(user.email, user.name);
    res.send(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
