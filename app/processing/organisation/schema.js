const Joi = require('joi')
const sbiMin = 105000000
const sbiMax = 999999999
const frnMin = 1000000000
const frnMax = 9999999999

module.exports = Joi.object({
  sbi: Joi.number().integer().min(sbiMin).max(sbiMax).required().messages({
    'number.base': 'sbi should be a type of number',
    'number.integer': 'sbi should be an integer',
    'number.min': `sbi should be greater than or equal to ${sbiMin}`,
    'number.max': `sbi should be less than or equal to ${sbiMax}`,
    'any.required': 'The field sbi is not present but it is required'
  }),
  addressLine1: Joi.string().allow('', null).optional().messages({
    'string.base': 'addressLine1 should be a type of string'
  }),
  addressLine2: Joi.string().allow('', null).optional().messages({
    'string.base': 'addressLine2 should be a type of string'
  }),
  addressLine3: Joi.string().allow('', null).optional().messages({
    'string.base': 'addressLine3 should be a type of string'
  }),
  city: Joi.string().allow('', null).optional().messages({
    'string.base': 'city should be a type of string'
  }),
  county: Joi.string().allow('', null).optional().messages({
    'string.base': 'county should be a type of string'
  }),
  emailAddress: Joi.string().allow('', null).optional().messages({
    'string.base': 'emailAddress should be a type of string'
  }),
  frn: Joi.number().integer().min(frnMin).max(frnMax).required().messages({
    'number.base': 'frn should be a type of number',
    'number.integer': 'frn should be an integer',
    'number.min': `frn should be greater than or equal to ${frnMin}`,
    'number.max': `frn should be less than or equal to ${frnMax}`,
    'any.required': 'The field frn is not present but it is required'
  }),
  name: Joi.string().required().messages({
    'string.base': 'name should be a type of string',
    'any.required': 'The field name is not present but it is required'
  }),
  postcode: Joi.string().allow('', null).optional().messages({
    'string.base': 'postcode should be a type of string'
  })
}).required().messages({
  'object.base': 'The input should be an object',
  'any.required': 'The input is not present but it is required'
})
