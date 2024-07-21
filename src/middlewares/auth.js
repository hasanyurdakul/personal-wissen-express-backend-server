const jwt = require("jsonwebtoken");

const tokenControl = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token)
    return res.status(401).json({ status: false, message: "Unauthorizated" });

  if (token.includes("Bearer")) {
    token = token.split(" ")[1];
  }
  jwt.verify(token, process.env.MYKEY, (err, data) => {
    if (err)
      return res.status(404).json({ status: false, message: "Unauthorizated" });
    req.data = data;
    next();
  });
};

module.exports = tokenControl;
