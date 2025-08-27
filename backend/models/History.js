const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    word: { type: String, required: true, lowercase: true, trim: true },
    definition: { type: String, default: "" }, // brief text we store for quick glance
  },
  { timestamps: true }
);

module.exports = mongoose.model("History", historySchema);
