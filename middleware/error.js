module.exports = function(error, req, res, next) {
  res.status(500).send("Some thing filed sorry try another time", error);
};
