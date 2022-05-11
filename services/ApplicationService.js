const Application = require('../models/Application');

class ApplicationService {
  async create(body) {
    const { name } = body;
    const lowerName = name.toLowerCase();
    const application = new Application({ name: lowerName });
    await application.save();

    return jsonSuccess(application);
  }

  async update(id, body) {
    const { name } = body;
    const application = await Application.findById(id).lean();
    if (name) application.name = name.toLowerCase();
    
    await application.save();

    return jsonSuccess(application);
  }

  async detail(id) {
    const application = await Application.findById(id);

    return jsonSuccess(application);
  }

  async list(params) {
    const applications = await Application.find();

    return jsonSuccess(applications);
  }
}

module.exports = ApplicationService;
