const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");
const { validateUserProfileData } = require("../middlewares/validation");

router.use(auth);
router.get("/me", getCurrentUser);
router.patch("/me", validateUserProfileData, updateUser);

module.exports = router;
