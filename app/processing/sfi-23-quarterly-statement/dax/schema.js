const Joi = require('joi')
const number30 = 30
const number200 = 200

module.exports = Joi.object({
  daxId: Joi.number().integer().messages({
    'number.base': 'daxId should be a type of number',
    'number.integer': 'daxId should be an integer'
  }),
  paymentReference: Joi.string().max(number30).required().messages({
    'string.base': 'paymentReference should be a type of string',
    'string.max': `paymentReference should have a maximum length of ${number30}`,
    'any.required': 'The field paymentReference is not present but it is required'
  }),
  calculationId: Joi.number().integer().messages({
    'number.base': 'calculationId should be a type of number',
    'number.integer': 'calculationId should be an integer'
  }),
  paymentPeriod: Joi.string().max(number200).allow('', null).optional().messages({
    'string.base': 'paymentPeriod should be a type of string',
    'string.max': `paymentPeriod should have a maximum length of ${number200}`
  }),
  paymentAmount: Joi.number().required().messages({
    'number.base': 'paymentAmount should be a type of number',
    'any.required': 'The field paymentAmount is not present but it is required'
  }),
  transactionDate: Joi.date().required().messages({
    'date.base': 'transactionDate should be a valid date',
    'any.required': 'The field transactionDate is not present but it is required'
  })
}).required().messages({
  'object.base': 'The input should be an object',
  'any.required': 'The input is not present but it is required'
})
