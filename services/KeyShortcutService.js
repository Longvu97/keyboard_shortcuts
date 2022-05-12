const KeyShortcut = require('../models/KeyShortcut');
const OperationSystem = require('../models/OperationSystem');
const Application = require('../models/Application');

const regexSpecialCharacter = /[^\w\s]/gi;
const MEANS_LENGTH = 5;
const ON_LENGTH = 2;

class KeyShortcutService {
  /**
   * Create a keyboard shortcut
   * 
   * @param {Object} body 
   * @returns {Object}
   */
  async create(body) {
    const { name } = body;
   
    const keyBoard = await this.getKeyBoard(name);
    if (!keyBoard) return jsonError(errors.FIELDS_KEYBOARD_IS_REQUIRED);

    const { nameKey, specific, osAndApplication } = keyBoard;
    const params = {
      name: nameKey,
      specific,
      operationSystemId: osAndApplication.osId,
      applicationId: osAndApplication.applicationId
    }
    const isExist = await KeyShortcut.findOne(params);
    if (isExist) return jsonError(errors.KEYBOARD_SHORTCUT_IS_EXIST);

    const keyShortcut = new KeyShortcut(params);
    await keyShortcut.save();

    return jsonSuccess(keyShortcut);
  }

  /**
   * Get list keyboard shortcut
   * 
   * @param {Object} query 
   * @returns {Object}
   */
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

  /**
   * Get detail keyboard shortcut
   * 
   * @param {ObjectId} id 
   * @returns 
   */
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
    if (!keyShortcut) return jsonError(errors.KEYBOARD_SHORTCUT_NOT_FOUND);

    return jsonSuccess(keyShortcut);
  }

  /**
   * Update keyboard shortcut
   * 
   * @param {ObjectId} id 
   * @param {Object} body 
   * @returns {Object}
   */
  async update(id, body) {
    const { name } = body;
    const keyShortcut = await KeyShortcut.findById(id);
    if (!keyShortcut) return jsonError(errors.KEYBOARD_SHORTCUT_NOT_FOUND);

    const keyBoard = await this.getKeyBoard(name);
    if (!keyBoard) return jsonError(errors.FIELDS_KEYBOARD_IS_REQUIRED);

    const { nameKey, specific, osAndApplication } = keyBoard;
    keyShortcut.name = nameKey;
    keyShortcut.specific = specific;
    keyShortcut.operationSystemId = osAndApplication.osId;
    keyShortcut.applicationId = osAndApplication.applicationId;
    await keyShortcut.save();

    return jsonSuccess(keyShortcut);
  }

  /**
   * Lower case and remove plus sign
   * 
   * @param {String} name 
   * @returns {String}
   */
  handleName(name) {
    return name.toLowerCase().replace(regexSpecialCharacter, ' ');
  }

  async getKeyBoard(input) {
    const meansIndex = input.indexOf('means');
    const onIndex = input.indexOf('on');
    let nameKey = input.slice(0, meansIndex).trim().toLowerCase();
    const specific = input.slice(meansIndex + MEANS_LENGTH, onIndex).trim().toLowerCase();
    const osAndApplicationStr = input.slice(onIndex + ON_LENGTH).trim().toLowerCase();

    if (!nameKey || !specific || !osAndApplicationStr) return {};

    nameKey =  this.handleName(nameKey);
    const osAndApplication = await this.getOsAndApplication(osAndApplicationStr);
    if (!osAndApplication) return {};

    return {
      nameKey,
      specific,
      osAndApplication
    };
  }

  /**
   * Get operation system and application
   * 
   * @param {String} osAndApplication 
   * @returns {Object}
   */
  async getOsAndApplication(osAndApplication) {
    //get operation system
    const operationSystems = await OperationSystem.find();
    const nameOperationSystems = operationSystems.map(os => { return { id: os.id, name: os.name } });
    const operationSystem = nameOperationSystems.find(os => osAndApplication.match(os.name));
    if (!operationSystem) return null;

    //get application
    const applications = await Application.find();
    const nameApplications = applications.map(app => { return { id: app.id, name: app.name } });
    const application = nameApplications.find(app => osAndApplication.match(app.name));

    return {
      osId: operationSystem.id,
      applicationId: application ? application.id : null
    }
  }
}

module.exports = KeyShortcutService;
