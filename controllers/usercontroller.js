const user = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const apperror = require('../utils/apperror');
const asynchandler = require('../utils/asynchandler');

const register = asynchandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const existinguser = await user.findOne({ email });
  if (existinguser) {
    return next(new apperror('email already registered', 400));
  }

  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);

  const newuser = await user.create({
    name,
    email,
    password: hashedpassword,
    role: role === 'admin' ? 'admin' : 'attendee',
  });

  res.status(201).json({
    status: 'success',
    data: {
      _id: newuser._id,
      name: newuser.name,
      email: newuser.email,
      role: newuser.role,
    },
  });
});

const login = asynchandler(async (req, res, next) => {
  const { email, password } = req.body;

  const founduser = await user.findOne({ email }).select('+password');
  if (!founduser) {
    return next(new apperror('invalid email or password', 401));
  }

  const ismatch = await bcrypt.compare(password, founduser.password);
  if (!ismatch) {
    return next(new apperror('invalid email or password', 401));
  }

  const token = jwt.sign(
    { id: founduser._id, role: founduser.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.status(200).json({
    status: 'success',
    token,
    user: {
      _id: founduser._id,
      name: founduser.name,
      email: founduser.email,
      role: founduser.role,
    },
  });
});

module.exports = { register, login };