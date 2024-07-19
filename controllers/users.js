const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  CONFLICT,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const { BadRequestError } = require("../errors/BadRequestError");
const { NotFoundError } = require("../errors/NotFoundError");
const { ForbiddenError } = require("../errors/ForbiddenError");
const { ConflictError } = require("../errors/ConflictError");
const { UnauthorizedError } = require("../errors/UnauthorizedError");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((newUser) => {
      const payload = newUser.toObject();
      delete payload.password;
      res.status(201).send({ data: payload });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid user data"));
      }
      if (err.code === 11000) {
        next(new ConflictError("User with such email already exists"));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestError("Enter both email and password"));
    return;
  }
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        next(new UnauthorizedError("Incorrect email or password"));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("There is no user with the requested ID"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("There is no user with the requested ID"));
      }
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid user data"));
      } else {
        next(err);
      }
    });
};

module.exports = { createUser, getCurrentUser, login, updateUser };
