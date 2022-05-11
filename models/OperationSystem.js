const mongoose = require('mongoose');

const OPERATION_SYSTEM = {
  MAC_OS: 'macOS',
  WINDOWS: 'WINDOWS'
};
const operationSystemSchema = new mongoose.Schema({
  name: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('OperationSystem', operationSystemSchema);
module.exports.OPERATION_SYSTEM = OPERATION_SYSTEM;
