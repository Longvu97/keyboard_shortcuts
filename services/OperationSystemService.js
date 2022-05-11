const OperationSystem = require('../models/OperationSystem');

class OperationSystemService {
  async create(body) {
    const { name } = body;
    const lowerName = name.toLowerCase();
    const operationSystem = new OperationSystem({ name: lowerName });
    await operationSystem.save();

    return jsonSuccess(operationSystem);
  }

  async update(id, body) {
    const { name } = body;
    const operationSystem = await OperationSystem.findById(id);
    if (name) operationSystem.name = name.toLowerCase();
    
    await operationSystem.save();
    return jsonSuccess(operationSystem);
  }

  async detail(id) {
    const operationSystem = await OperationSystem.findById(id);

    return jsonSuccess(operationSystem);
  }

  async list(params) {
    const operationSystems = await OperationSystem.find();

    return jsonSuccess(operationSystems);
  }
}

module.exports = OperationSystemService;
