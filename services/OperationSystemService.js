const OperationSystem = require('../models/OperationSystem');

class OperationSystemService {
  /**
   * Create a operation system
   * 
   * @param {Object} body 
   * @returns {Object}
   */
  async create(body) {
    const { name } = body;
    const lowerName = name.toLowerCase();
    const isExist = await OperationSystem.findOne({ name: lowerName });
    if (isExist) return jsonError(errors.OPERATION_SYSTEM_IS_EXIST);

    const operationSystem = new OperationSystem({ name: lowerName });
    await operationSystem.save();

    return jsonSuccess(operationSystem);
  }

  /**
   * Update a operation system
   * 
   * @param {ObjectId} id 
   * @param {Object} body 
   * @returns 
   */
  async update(id, body) {
    const { name } = body;
    const operationSystem = await OperationSystem.findById(id);
    if (!operationSystem) return jsonError(errors.OPERATION_SYSTEM_NOT_FOUND);
    if (name) operationSystem.name = name.toLowerCase();
    
    await operationSystem.save();
    return jsonSuccess(operationSystem);
  }

  /**
   * Get detail a operation system
   * 
   * @param {ObjectId} id 
   * @returns {Object}
   */
  async detail(id) {
    const operationSystem = await OperationSystem.findById(id);
    if (!operationSystem) return jsonError(errors.OPERATION_SYSTEM_NOT_FOUND);

    return jsonSuccess(operationSystem);
  }

  /**
   * Get list operation system
   * 
   * @returns {Object}
   */
  async list() {
    const operationSystems = await OperationSystem.find();

    return jsonSuccess(operationSystems);
  }
}

module.exports = OperationSystemService;
