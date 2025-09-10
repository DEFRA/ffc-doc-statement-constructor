const Joi = require('joi')
const { ORGANISATION } = require('../../constants/types')

const frnMin = 1000000000
const frnMax = 9999999999
const sbiMin = 105000000
const sbiMax = 999999999
const postcodeMax = 8
const maxNameLength = 160
const addressLineMax = 240
const cityCountyMax = 127
const emailMax = 260

module.exports = Joi.object({
  name: Joi.string().required().max(maxNameLength).messages({
    'string.base': 'name must be a type of string',
    'string.max': `name must have a maximum length of ${maxNameLength}`,
    'any.required': 'The field name is not present but it is required'
  }),
  sbi: Joi.number().integer().min(sbiMin).max(sbiMax).required().messages({
    'number.base': 'sbi must be a type of number',
    'number.integer': 'sbi must be an integer',
    'number.min': `sbi must have a minimum value of ${sbiMin}`,
    'number.max': `sbi must have a maximum value of ${sbiMax}`,
    'any.required': 'The field sbi is not present but it is required'
  }),
  frn: Joi.number().integer().min(frnMin).max(frnMax).required().messages({
    'number.base': 'frn must be a type of number',
    'number.integer': 'frn must be an integer',
    'number.min': `frn must have a minimum value of ${frnMin}`,
    'number.max': `frn must have a maximum value of ${frnMax}`,
    'any.required': 'The field frn is not present but it is required'
  }),
  addressLine1: Joi.string().allow('').max(addressLineMax).messages({
    'string.base': 'addressLine1 must be a type of string',
    'string.max': `addressLine1 must have a maximum length of ${addressLineMax}`
  }),
  addressLine2: Joi.string().allow('').max(addressLineMax).messages({
    'string.base': 'addressLine2 must be a type of string',
    'string.max': `addressLine2 must have a maximum length of ${addressLineMax}`
  }),
  addressLine3: Joi.string().allow('').max(addressLineMax).messages({
    'string.base': 'addressLine3 must be a type of string',
    'string.max': `addressLine3 must have a maximum length of ${addressLineMax}`
  }),
  city: Joi.string().allow('').max(cityCountyMax).messages({
    'string.base': 'city must be a type of string',
    'string.max': `city must have a maximum length of ${cityCountyMax}`
  }),
  county: Joi.string().allow('').max(cityCountyMax).messages({
    'string.base': 'county must be a type of string',
    'string.max': `county must have a maximum length of ${cityCountyMax}`
  }),
  postcode: Joi.string().max(postcodeMax).required().messages({
    'string.base': 'postcode must be a type of string',
    'string.length': `postcode must have a maximum length of ${postcodeMax}`,
    'any.required': 'The field postcode is not present but it is required'
  }),
  emailAddress: Joi.string().allow('').max(emailMax).messages({
    'string.base': 'emailAddress must be a type of string',
    'string.max': `emailAddress must have a maximum length of ${emailMax}`
  }),
  updated: Joi.date().required().messages({
    'date.base': 'updated must be a type of date',
    'any.required': 'The field updated is not present but it is required'
  }),
  type: Joi.string().valid(ORGANISATION).required().messages({
    'string.base': 'type must be a type of string',
    'any.only': `type must be ${ORGANISATION}`,
    'any.required': 'The field type is not present but it is required'
  })
})
