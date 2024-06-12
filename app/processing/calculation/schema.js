const Joi = require('joi')

module.exports = Joi.object({
  calculationId: Joi.number().integer().required().messages({
    'number.base': 'calculationId should be a type of number',
    'number.integer': 'calculationId should be an integer',
    'any.required': 'The field calculationId is not present but it is required'
  }),
  calculationDate: Joi.date().required().messages({
    'date.base': 'calculationDate should be a valid date',
    'any.required': 'The field calculationDate is not present but it is required'
  }),
  invoiceNumber: Joi.string().required().messages({
    'string.base': 'invoiceNumber should be a type of string',
    'any.required': 'The field invoiceNumber is not present but it is required'
  }),
  paymentRequestId: Joi.number().integer().required().messages({
    'number.base': 'paymentRequestId should be a type of number',
    'number.integer': 'paymentRequestId should be an integer',
    'any.required': 'The field paymentRequestId is not present but it is required'
  }),
  sbi: Joi.number().integer().required().messages({
    'number.base': 'sbi should be a type of number',
    'number.integer': 'sbi should be an integer',
    'any.required': 'The field sbi is not present but it is required'
  })
}).required()
