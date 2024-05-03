const Joi = require('joi')
const sbiMin = 105000000
const sbiMax = 999999999
const frnMin = 1000000000
const frnMax = 9999999999

module.exports = Joi.object({
  sbi: Joi.number().integer().min(sbiMin).max(sbiMax).required(),
  addressLine1: Joi.string().allow('', null).optional(),
  addressLine2: Joi.string().allow('', null).optional(),
  addressLine3: Joi.string().allow('', null).optional(),
  city: Joi.string().allow('', null).optional(),
  county: Joi.string().allow('', null).optional(),
  emailAddress: Joi.string().allow('', null).optional(),
  frn: Joi.number().integer().min(frnMin).max(frnMax).required(),
  name: Joi.string().required(),
  postcode: Joi.string().allow('', null).optional()
}).required()
