const Joi = require('joi')

const minSbi = 105000000
const maxSbi = 999999999
const number15 = 15
const number20 = 20
const number50 = 50

module.exports = Joi.object({
  calculationReference: Joi.number().integer().required().messages({
    'number.base': 'calculationReference should be a type of number',
    'number.integer': 'calculationReference should be an integer',
    'any.required': 'The field calculationReference is not present but it is required'
  }),
  agreementNumber: Joi.number().integer().required().messages({
    'number.base': 'agreementNumber should be a type of number',
    'number.integer': 'agreementNumber should be an integer',
    'any.required': 'The field agreementNumber is not present but it is required'
  }),
  claimReference: Joi.number().integer().required().messages({
    'number.base': 'claimReference should be a type of number',
    'number.integer': 'claimReference should be an integer',
    'any.required': 'The field claimReference is not present but it is required'
  }),
  sbi: Joi.number().integer().min(minSbi).max(maxSbi).required().messages({
    'number.base': 'sbi should be a type of number',
    'number.integer': 'sbi should be an integer',
    'number.min': `sbi should be greater than or equal to ${minSbi}`,
    'number.max': `sbi should be less than or equal to ${maxSbi}`,
    'any.required': 'The field sbi is not present but it is required'
  }),
  schemeCode: Joi.string().max(number50).required().messages({
    'string.base': 'schemeCode should be a type of string',
    'string.max': `schemeCode should have a maximum length of ${number50}`,
    'any.required': 'The field schemeCode is not present but it is required'
  }),
  calculationDate: Joi.date().required().messages({
    'date.base': 'calculationDate should be a valid date',
    'any.required': 'The field calculationDate is not present but it is required'
  }),
  invoiceNumber: Joi.string().max(number20).required().messages({
    'string.base': 'invoiceNumber should be a type of string',
    'string.max': `invoiceNumber should have a maximum length of ${number20}`,
    'any.required': 'The field invoiceNumber is not present but it is required'
  }),
  agreementStart: Joi.date().required().messages({
    'date.base': 'agreementStart should be a valid date',
    'any.required': 'The field agreementStart is not present but it is required'
  }),
  agreementEnd: Joi.date().required().messages({
    'date.base': 'agreementEnd should be a valid date',
    'any.required': 'The field agreementEnd is not present but it is required'
  }),
  totalAdditionalPayments: Joi.number().precision(number15).required().messages({
    'number.base': 'totalAdditionalPayments should be a type of number',
    'number.precision': `totalAdditionalPayments should have a maximum precision of ${number15}`,
    'any.required': 'The field totalAdditionalPayments is not present but it is required'
  }),
  totalActionPayments: Joi.number().precision(number15).required().messages({
    'number.base': 'totalActionPayments should be a type of number',
    'number.precision': `totalActionPayments should have a maximum precision of ${number15}`,
    'any.required': 'The field totalActionPayments is not present but it is required'
  }),
  totalPayments: Joi.number().precision(number15).required().messages({
    'number.base': 'totalPayments should be a type of number',
    'number.precision': `totalPayments should have a maximum precision of ${number15}`,
    'any.required': 'The field totalPayments is not present but it is required'
  })
}).required().messages({
  'object.base': 'The input should be an object',
  'any.required': 'The input is not present but it is required'
})
