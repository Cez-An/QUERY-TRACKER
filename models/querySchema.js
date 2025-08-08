import { Schema, model as _model } from 'mongoose';

const querySchema = new Schema({
  queryNumber: { type: String, unique: true, required: true },
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

export default _model('Query', querySchema);
