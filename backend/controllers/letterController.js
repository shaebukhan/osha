const Letter = require("../models/Letter");

const getAllLetters = async (req, res) => {
  try {
    const letters = await Letter.find();
    res.json(letters);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch letters" });
  }
};

module.exports = { getAllLetters };
