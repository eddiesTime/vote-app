const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    req.isAdmin = false;
    return next();
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'secretvotingappappsecret');
  } catch (err) {
    req.isAdmin = false;
    return next();
  }
  if (!decodedToken) {
    req.isAdmin = false;
    return next();
  }

  if (!decodedToken.isAdmin) {
    const error = new Error('Not authorized!');
    error.code = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  req.isAdmin = true;
  next();
};
