const express = require("express");
const router = express.Router();
const { validateTask, Task } = require("../model/task");
const auth = require("../middleware/auth");
const { User } = require("../model/user");

router.post("/", auth, async (req, res) => {
  const { error } = validateTask(req.body);
  if (error) return res.send(error);

  const task = new Task({
    ...req.body,
    owner: req.user._id
  });
  await task.save();
  res.status(200).send(task);
});

router.get("/", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[0] === desc ? -1 : 1;
  }
  try {
    const user = await User.findById(req.user._id);

    await user
      .populate({
        path: "userTasks",
        match: match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort
        }
      })
      .execPopulate();
    res.status(200).send(user.userTasks);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    // const task = await Task.findById(req.params.id);

    const task = await Task.findOne({ _id, owner: req.user._id });

    console.log(user);
    if (!task) return res.status(404).send("Sorry not validate id ");

    res.status(200).send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];

  const isValidate = updates.every(update => allowedUpdates.includes(update));

  if (isValidate === false)
    return res.status(400).send({
      error: "invalid operation!"
    });

  const { error } = validateTask(req.body);
  if (error) return res.send(400).send(error);

  // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
  //   new: true,
  //   runValidators: true
  // });

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });
    if (!task) res.status(404).send("task you lookup about him not exist ");

    updates.forEach(update => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (err) {}
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });
    if (!task)
      return res
        .status(404)
        .send("no fucking task with this id mother fucker :p");

    res.send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
