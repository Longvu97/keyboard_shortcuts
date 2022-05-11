const express = require('express');
const router = express.Router();
const OperationSystemService = require('../services/OperationSystemService');
const validator = require('express-joi-validation').createValidator({});
const { create } = require('../middlewares/Application');

const operationSystemService = new OperationSystemService();

router.post('', validator.body(create), async (req, res) => {
  try {
    const { body } = req;
    const result = await operationSystemService.create(body);

    res.json(result);
  } catch (err) {
    console.log(err);
    res.send(jsonError(errors.CREATE_OPERTAION_SYSTEM_FAILED));
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { params } = req;
    const result = await operationSystemService.detail(params.id);

    res.json(result);
  } catch (err) {
    console.log(err);
    res.send(jsonError(errors.OPERATION_SYSTEM_NOT_FOUND));
  }
});

router.get('', async (req, res) => {
  try {
    const result = await operationSystemService.list();

    res.json(result);
  } catch (err) {
    console.log(err);
    res.send(jsonError(errors.OPERATION_SYSTEM_NOT_FOUND));
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { body, params } = req;
    const result = await operationSystemService.update(params.id, body);

    res.json(result);
  } catch (err) {
    console.log(err);
    res.send(jsonError(errors.UPDATE_OPERTAION_SYSTEM_FAILED));
  }
});

module.exports = {
  path: 'operation-systems',
  router
};
