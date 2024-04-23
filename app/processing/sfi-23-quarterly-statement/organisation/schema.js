const Joi = require('joi')

const minSbi = 105000000
const maxSbi = 999999999
const minFrn = 1000000000
const maxFrn = 9999999999

module.exports = Joi.object({
  sbi: Joi.number().integer().min(minSbi).max(maxSbi).required(),
  addressLine1: Joi.string().allow('', null).optional(),
  addressLine2: Joi.string().allow('', null).optional(),
  addressLine3: Joi.string().allow('', null).optional(),
  city: Joi.string().allow('', null).optional(),
  county: Joi.string().allow('', null).optional(),
  emailAddress: Joi.string().allow('', null).optional(),
  frn: Joi.number().integer().min(minFrn).max(maxFrn).required(),
  name: Joi.string().required(),
  postcode: Joi.string().allow('', null).optional()
}).required()
