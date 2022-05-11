const mongoose = require('mongoose');

const keyShortcutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specific: { type: String, required: true },
  operationSystemId: { type: mongoose.Schema.ObjectId, ref: 'OperationSystem', required: true },
  applicationId: { type: mongoose.Schema.ObjectId, ref: 'Application', default: null },
  description: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('KeyShortcut', keyShortcutSchema);
