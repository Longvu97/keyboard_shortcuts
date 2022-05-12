const express = require('express');
const router = express.Router();
const KeyShortcutService = require('../services/KeyShortcutService');
const validator = require('express-joi-validation').createValidator({});
const { create, update } = require('../middlewares/KeyShortcut');

const keyShortcutService = new KeyShortcutService();

router.post('', validator.body(create), async (req, res) => {
  try {
    const { body } = req;
    const result = await keyShortcutService.create(body);

    res.json(result);
  } catch (err) {
    console.log(err);
    res.json(jsonError(errors.CREATE_KEYBOARD_SHORTCUT_FAILED));
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { params } = req;
    const result = await keyShortcutService.detail(params.id);

    res.json(result);
  } catch (err) {
    console.log(err);
    res.json(jsonError(errors.GET_KEYBOARD_SHORTCUT_FAILED));
  }
});

router.get('', async (req, res) => {
  try {
    const result = await keyShortcutService.list(req.query);

    res.json(result);
  } catch (err) {
    console.log(err);
    res.json(jsonError(errors.GET_KEYBOARD_SHORTCUT_FAILED));
  }
});

router.patch('/:id', validator.body(update), async (req, res) => {
  try {
    const { body, params } = req;
    const result = await keyShortcutService.update(params.id, body);

    res.json(result);
  } catch (err) {
    console.log(err);
    res.json(jsonError(errors.UPDATE_KEYBOARD_SHORTCUT_FAILED));
  }
});

module.exports = {
  path: 'key-shortcuts',
  router
};
