const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  authorName: String,
  sbNumber: String,
  model: String,
  revision: String,
  status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
  resolverName: String,
  createdAt: { type: Date, default: Date.now },
  resolvedAt: Date,
  comment: String,
  pdfFiles: [String], // stores file paths or names
});

module.exports = mongoose.model('Query', querySchema);
