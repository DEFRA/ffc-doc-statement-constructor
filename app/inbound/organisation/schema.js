const Joi = require('joi')
const { CALCULATION, ORGANISATION } = require('../../constants/types')

const frnMin = 1000000000
const frnMax = 9999999999
const sbiMin = 105000000
const sbiMax = 999999999
const postcodeMax = 8

module.exports = Joi.object({
  sbi: Joi.number().integer().min(sbiMin).max(sbiMax).required().messages({
    'number.base': 'sbi must be a type of number',
    'number.integer': 'sbi must be an integer',
    'number.min': `sbi must have a minimum value of ${sbiMin}`,
    'number.max': `sbi must have a maximum value of ${sbiMax}`,
    'any.required': 'The field sbi is not present but it is required'
  }),
  addressLine1: Joi.string().allow('').messages({
    'string.base': 'addressLine1 must be a type of string'
  }),
  addressLine2: Joi.string().allow('').messages({
    'string.base': 'addressLine2 must be a type of string'
  }),
  addressLine3: Joi.string().allow('').messages({
    'string.base': 'addressLine3 must be a type of string'
  }),
  city: Joi.string().allow('').messages({
    'string.base': 'city must be a type of string'
  }),
  county: Joi.string().allow('').messages({
    'string.base': 'county must be a type of string'
  }),
  emailAddress: Joi.string().email().allow('').messages({
    'string.base': 'emailAddress must be a type of string',
    'string.email': 'emailAddress must be a valid email'
  }),
  frn: Joi.number().integer().min(frnMin).max(frnMax).required().messages({
    'number.base': 'frn must be a type of number',
    'number.integer': 'frn must be an integer',
    'number.min': `frn must have a minimum value of ${frnMin}`,
    'number.max': `frn must have a maximum value of ${frnMax}`,
    'any.required': 'The field frn is not present but it is required'
  }),
  name: Joi.string().required().messages({
    'string.base': 'name must be a type of string',
    'any.required': 'The field name is not present but it is required'
  }),
  postcode: Joi.string().max(postcodeMax).required().messages({
    'string.base': 'postcode must be a type of string',
    'string.length': `postcode must have a maximum length of ${postcodeMax}`,
    'any.required': 'The field postcode is not present but it is required'
  }),
  type: Joi.string().valid(CALCULATION, ORGANISATION).required().messages({
    'string.base': 'type must be a type of string',
    'any.only': `type must be either ${CALCULATION} or ${ORGANISATION}`,
    'any.required': 'The field type is not present but it is required'
  }),
  updated: Joi.date().required().messages({
    'date.base': 'updated must be a type of date',
    'any.required': 'The field updated is not present but it is required'
  })
})
