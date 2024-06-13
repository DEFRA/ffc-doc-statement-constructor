const Joi = require('joi')

const minSbi = 105000000
const maxSbi = 999999999
const minFrn = 1000000000
const maxFrn = 9999999999

module.exports = Joi.object({
  sbi: Joi.number().integer().min(minSbi).max(maxSbi).required().messages({
    'number.base': 'sbi should be a type of number',
    'number.integer': 'sbi should be an integer',
    'number.min': `sbi should be greater than or equal to ${minSbi}`,
    'number.max': `sbi should be less than or equal to ${maxSbi}`,
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
  frn: Joi.number().integer().min(minFrn).max(maxFrn).required().messages({
    'number.base': 'frn should be a type of number',
    'number.integer': 'frn should be an integer',
    'number.min': `frn should be greater than or equal to ${minFrn}`,
    'number.max': `frn should be less than or equal to ${maxFrn}`,
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
