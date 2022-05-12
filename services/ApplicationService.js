const Application = require('../models/Application');

class ApplicationService {
  /**
   * Create application
   * 
   * @param {Object} body 
   * @returns {Object}
   */
  async create(body) {
    const { name } = body;
    const lowerName = name.toLowerCase();
    const isExist = await Application.findOne({ name: lowerName })
    if (isExist) return jsonError(errors.APPLICATION_IS_EXIST);

    const application = new Application({ name: lowerName });
    await application.save();

    return jsonSuccess(application);
  }

  /**
   * Update application
   * 
   * @param {ObjectId} id 
   * @param {Object} body 
   * @returns {Object}
   */
  async update(id, body) {
    const { name } = body;
    const application = await Application.findById(id).lean();
    if (!application) return jsonError(errors.APPLICATION_NOT_FOUND);
    if (name) application.name = name.toLowerCase();
    
    await application.save();

    return jsonSuccess(application);
  }

  /**
   * Get detail a applicaiton
   * 
   * @param {ObjectId} id 
   * @returns {Object}
   */
  async detail(id) {
    const application = await Application.findById(id);
    if (!application) return jsonError(errors.APPLICATION_NOT_FOUND);

    return jsonSuccess(application);
  }

  /**
   * Get list application
   * 
   * @returns {Object}
   */
  async list() {
    const applications = await Application.find();

    return jsonSuccess(applications);
  }
}

module.exports = ApplicationService;
