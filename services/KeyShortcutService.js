const KeyShortcut = require('../models/KeyShortcut');
const OperationSystem = require('../models/OperationSystem');
const Application = require('../models/Application');

const regexSpecialCharacter = /[^\w\s]/gi;

class KeyShortcutService {
  async create(body) {
    const { name, operationSystemId, applicationId, description, specific } = body;
    await OperationSystem.findById(operationSystemId);

    if (applicationId) {
      await Application.findById(applicationId);
    }

    const keyShortcut = new KeyShortcut({
      name: this.handleName(name),
      specific: specific.toLowerCase(),
      description,
      operationSystemId,
      applicationId,
    });
    await keyShortcut.save();

    return jsonSuccess(keyShortcut);
  }

  async detail(id) {
    const keyShortcut = await KeyShortcut
      .findById(id)
      .populate({
        path: 'operationSystemId',
        select: '_id name'
      })
      .populate({
        path: 'applicationId',
        select: '_id name'
      });

    return jsonSuccess(keyShortcut);
  }

  async list(query) {
    const { name, systemId, specific, applicationId, limit = 10, page = 1 } = query;
    const condition = {};
    if (name) condition.name = { $regex: `.*${this.handleName(name)}.*` };
    if (systemId) condition.operationSystemId = systemId;
    if (applicationId) condition.applicationId = applicationId;
    if (specific) condition.specific = specific.toLowerCase();

    const skip = +limit * (Math.max(0, page) - 1);
    const total = await KeyShortcut.find(condition).count();
    const keyShortcuts = await KeyShortcut
      .find(condition)
      .populate({
        path: 'operationSystemId',
        select: '_id name'
      })
      .populate({
        path: 'applicationId',
        select: '_id name'
      })
      .sort({ updatedAt: -1 })
      .limit(+limit)
      .skip(skip);

    return jsonSuccess({
      page,
      limit,
      total,
      data: keyShortcuts
    });
  }

  async update(id, body) {
    const { operationSystemId, applicationId, description } = body;
    let { name } = body;
    const keyShortcut = await KeyShortcut.findById(id);
    if (operationSystemId) {
      await OperationSystem.findById(operationSystemId);
      keyShortcut.operationSystemId = operationSystemId;
    }

    if (applicationId) {
      await Application.findById(applicationId);
      keyShortcut.applicationId = applicationId;
    }

    if (name) {
      name = name.toLowerCase();
      keyShortcut.name = name;
    }

    if (description) keyShortcut.description = description;

    await keyShortcut.save();

    return jsonSuccess(keyShortcut);
  }

  handleName(name) {
    return name.toLowerCase().replace(regexSpecialCharacter, ' ');
  }
}

module.exports = KeyShortcutService;
