const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_CODE);

    req.user = decoded;

    next();
  } catch (err) {
    res.status(400).send("invalid token.");
  }
}

module.exports = auth;
/*nhgjsds*/
