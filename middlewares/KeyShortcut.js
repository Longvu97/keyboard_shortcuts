const Joi = require('joi');

const create = Joi.object({
  name: Joi.string().required()
});

const update = Joi.object({
  name: Joi.string().required()
});

module.exports = {
  create,
  update,
};
