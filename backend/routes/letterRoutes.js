const express = require("express");
const router = express.Router();
const { getAllLetters } = require("../controllers/letterController");

router.get("/get-all-letters", getAllLetters);

module.exports = router;
