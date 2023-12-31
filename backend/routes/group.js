const express = require("express");
const router = express.Router();
const groupCtrl = require("../controllers/group");

router.post("/", groupCtrl.createGroup);
router.get("/", groupCtrl.index);
router.get("/:id", groupCtrl.showGroup);
router.get("/favorites/:id", groupCtrl.showFavorites);
router.delete("/meal/:id/:mid", groupCtrl.deleteFavorite);
router.put("/:id", groupCtrl.updateGroup);
router.put("/meal/:id/:mid", groupCtrl.updateGroupMeals);
router.delete("/:id", groupCtrl.deleteGroup);

module.exports = router;
