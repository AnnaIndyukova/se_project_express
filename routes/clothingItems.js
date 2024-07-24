const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const { validateCardBody, validateId } = require("../middlewares/validation");

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
} = require("../controllers/clothingItems");

router.get("/", getClothingItems);

router.use(auth);

router.post("/", validateCardBody, createClothingItem);
router.delete("/:itemId", validateId, deleteClothingItem);
router.put("/:itemId/likes", validateId, likeClothingItem);
router.delete("/:itemId/likes", validateId, dislikeClothingItem);

module.exports = router;
