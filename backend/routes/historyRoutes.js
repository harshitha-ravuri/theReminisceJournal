const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { addHistory, getHistory, searchHistory } = require("../controllers/historyController");

router.post("/", auth, addHistory);
router.get("/", auth, getHistory);
router.get("/search", auth, searchHistory); // 🔹 new search endpoint

module.exports = router;
