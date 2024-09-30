const Joi = require('joi')
const D365 = 'd365'

const paymentReferenceChars = 30
const paymentPeriodChars = 200

module.exports = Joi.object({
  paymentReference: Joi.string().max(paymentReferenceChars).required().messages({
    'string.base': 'paymentReference should be a type of string',
    'string.max': `paymentReference should have a maximum length of ${paymentReferenceChars}`,
    'any.required': 'The field paymentReference is not present but it is required'
  }),
  calculationReference: Joi.number().integer().allow(null).messages({
    'number.base': 'calculationReference should be a type of number',
    'number.integer': 'calculationReference must be an integer'
  }),
  paymentPeriod: Joi.string().max(paymentPeriodChars).allow('', null).optional().messages({
    'string.base': 'paymentPeriod should be a type of string',
    'string.max': `paymentPeriod should have a maximum length of ${paymentPeriodChars}`
  }),
  paymentAmount: Joi.number().required().messages({
    'number.base': 'paymentAmount should be a type of number',
    'any.required': 'The field paymentAmount is not present but it is required'
  }),
  transactionDate: Joi.date().required().messages({
    'date.base': 'transactionDate should be a type of date',
    'any.required': 'The field transactionDate is not present but it is required'
  }),
  datePublished: Joi.date().allow(null).messages({
    'date.base': 'datePublished should be a type of date'
  }),
  type: Joi.string().required().allow(D365).messages({
    'string.base': 'type should be a type of string',
    'any.required': 'The field type is not present but it is required',
    'any.only': `type must be ${D365}`
  })
})
