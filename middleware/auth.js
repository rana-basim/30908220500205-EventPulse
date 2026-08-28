const jwt = require('jsonwebtoken');
const user = require('../models/user');
const apperror = require('../utils/apperror');
const asynchandler = require('../utils/asynchandler');

const requireauth = asynchandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new apperror('you are not logged in! please log in to get access.', 401));
  }

  const decoded = jwt.verify(token, process.env.jwt_secret);

  const currentuser = await user.findById(decoded.id).select('-password');
  if (!currentuser) {
    return next(
      new apperror('the user belonging to this token no longer exists.', 401)
    );
  }

  req.user = currentuser;
  next();
});

const requirerole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new apperror('you do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

module.exports = { requireauth, requirerole };
