const Joi = require('joi')

module.exports = Joi.object({
  sbi: Joi.number().integer().min(105000000).max(999999999).required(),
  addressLine1: Joi.string().allow('', null).optional(),
  addressLine2: Joi.string().allow('', null).optional(),
  addressLine3: Joi.string().allow('', null).optional(),
  city: Joi.string().allow('', null).optional(),
  county: Joi.string().allow('', null).optional(),
  emailAddress: Joi.string().allow('', null).optional(),
  frn: Joi.number().integer().min(1000000000).max(9999999999).required(),
  name: Joi.string().required(),
  postcode: Joi.string().allow('', null).optional()
}).required()
