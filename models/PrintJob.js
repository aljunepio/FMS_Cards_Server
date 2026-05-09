const mongoose = require("mongoose");

const PrintJobSchema = new mongoose.Schema({
  frontImage: {
    type: String,
    required: true,
  },

  backImage: {
    type: String,
  },

  status: {
    type: String,
    default: "pending",  // pending | processing | done
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  printedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("PrintJob", PrintJobSchema);