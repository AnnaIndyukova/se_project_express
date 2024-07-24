const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const NotFoundError = require("../errors/NotFoundError");
const { createUser, login } = require("../controllers/users");
const {
  validateUserBody,
  validateUserLogin,
} = require("../middlewares/validation");

router.post("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});
router.post("/signup", validateUserBody, createUser);
router.post("/signin", validateUserLogin, login);
router.use("/items", itemRouter);
router.use("/users", userRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
