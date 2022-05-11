const express = require('express');
const router = express.Router();
const ApplicationService = require('../services/ApplicationService');
const validator = require('express-joi-validation').createValidator({});
const { create, update } = require('../middlewares/Application');

const applicationService = new ApplicationService();

router.post('', validator.body(create), async (req, res) => {
  try {
    const { body } = req;
    const result = await applicationService.create(body);

    res.json(result);
  } catch (err) {
    console.log(err);
    res.send(jsonError(errors.CREATE_APPLICATION_FAILED));
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { params } = req;
    const result = await applicationService.detail(params.id);

    res.json(result);
  } catch (err) {
    console.log(err);
    res.send(jsonError(errors.APPLICATION_NOT_FOUND));
  }
});

router.get('', async (req, res) => {
  try {
    const result = await applicationService.list();

    res.json(result);
  } catch (err) {
    console.log(err);
    res.send(jsonError(errors.APPLICATION_NOT_FOUND));
  }
});

router.patch('/:id', validator.body(update), async (req, res) => {
  try {
    const { body, params } = req;
    const result = await applicationService.update(params.id, body);

    res.json(result);
  } catch (err) {
    console.log(err);
    res.send(jsonError(errors.UPDATE_APPLICATION_FAILED));
  }
});

module.exports = {
  path: 'applications',
  router
};
