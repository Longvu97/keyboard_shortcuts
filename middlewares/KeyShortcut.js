const Joi = require('joi');

const create = Joi.object({
  name: Joi.string().required(),
  specific: Joi.string().required(),
  operationSystemId: Joi.string().required(),
  applicationId: Joi.string().allow(''),
  description: Joi.string().allow('')
});

const update = Joi.object({
  name: Joi.string().allow(''),
  specific: Joi.string().allow(''),
  operationSystemId: Joi.string().allow(''),
  applicationId: Joi.string().allow(''),
  description: Joi.string().allow('')
});

module.exports = {
  create,
  update,
};
