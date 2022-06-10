const jwt = require("jsonwebtoken");
const config = process.env;

const verifyToken = (req, res, next) => {
    
  const token = req.headers["authorization"];
    //req.body.token || req.query.token || 
    
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
    
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
    //console.log('Auth OK')
  } catch (err) {
    return res.status(401).send("Invalid Token: " + token);
  }
  return next();
};

module.exports = verifyToken;