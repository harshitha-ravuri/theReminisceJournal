const History = require("../models/History");

// POST /api/history
exports.addHistory = async (req, res) => {
  try {
    const { word, definition } = req.body;
    if (!word) return res.status(400).json({ message: "Word is required" });

    const item = await History.create({
      user: req.userId,
      word,
      definition: definition || "",
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to save history", error: err.message });
  }
};

// GET /api/history
exports.getHistory = async (req, res) => {
  try {
    const items = await History.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .lean();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to load history", error: err.message });
  }
};

// GET /api/history/search
exports.searchHistory = async (req, res) => {
  try {
    const { q, date } = req.query; // q = word, date = YYYY-MM-DD

    const filter = { user: req.userId };

    if (q) {
      filter.word = { $regex: q, $options: "i" }; // case-insensitive
    }

    if (date) {
      // match documents created on the same calendar date
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.createdAt = { $gte: start, $lt: end };
    }

    const items = await History.find(filter).sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to search history", error: err.message });
  }
};

