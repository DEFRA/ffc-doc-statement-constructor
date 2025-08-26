const Joi = require('joi')
const D365 = 'd365'

const paymentReferenceChars = 30
const paymentPeriodChars = 200
const marketingYearMin = 2023
const marketingYearMax = 2050

module.exports = Joi.object({
  paymentReference: Joi.string()
    .trim()
    .pattern(/^PY\d{8,10}$/)
    .max(paymentReferenceChars)
    .required()
    .messages({
      'string.base': 'paymentReference should be a type of string',
      'string.empty': 'paymentReference cannot be empty',
      'string.max': `paymentReference should have a maximum length of ${paymentReferenceChars}`,
      'string.pattern.base': 'paymentReference must start with "PY" followed by 7 to 10 digits (example: PY12345678)',
      'any.required': 'The field paymentReference is not present but it is required'
    }),
  calculationId: Joi.number().integer().allow(null).messages({
    'number.base': 'calculationId should be a type of number',
    'number.integer': 'calculationId must be an integer'
  }),
  calculationReference: Joi.number().integer().allow(null).messages({
    'number.base': 'calculationReference should be a type of number',
    'number.integer': 'calculationReference must be an integer'
  }),
  paymentPeriod: Joi.string().max(paymentPeriodChars).allow('', null).optional().messages({
    'string.base': 'paymentPeriod should be a type of string',
    'string.max': `paymentPeriod should have a maximum length of ${paymentPeriodChars}`
  }),
  marketingYear: Joi.number().integer().min(marketingYearMin).max(marketingYearMax).required().messages({
    'number.base': 'maxketingYear should be a type of number',
    'number.integer': 'marketingYear must be an integer',
    'number.min': 'marketingYear should have minimum year of ' + marketingYearMin,
    'number.max': 'marketingYear should have maximim year of ' + marketingYearMax
  }),
  paymentAmount: Joi.number().required().messages({
    'number.base': 'paymentAmount should be a type of number',
    'any.required': 'The field paymentAmount is not present but it is required'
  }),
  transactionDate: Joi.date().required().messages({
    'date.base': 'transactionDate should be a type of date',
    'any.required': 'The field transactionDate is not present but it is required'
  }),
  type: Joi.string().required().valid(D365).messages({
    'string.base': 'type should be a type of string',
    'any.required': 'The field type is not present but it is required',
    'any.only': `type must be ${D365}`
  })
})
