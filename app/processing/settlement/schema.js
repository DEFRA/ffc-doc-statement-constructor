const Joi = require('joi')

module.exports = Joi.object({
  paymentRequestId: Joi.number().integer().required().messages({
    'number.base': 'paymentRequestId should be a type of number',
    'number.integer': 'paymentRequestId should be an integer',
    'any.required': 'The field paymentRequestId is not present but it is required'
  }),
  invoiceNumber: Joi.string().required().messages({
    'string.base': 'invoiceNumber should be a type of string',
    'any.required': 'The field invoiceNumber is not present but it is required'
  }),
  reference: Joi.string().required().messages({
    'string.base': 'reference should be a type of string',
    'any.required': 'The field reference is not present but it is required'
  }),
  settled: Joi.boolean().required().messages({ 
    'boolean.base': 'settled should be a type of boolean',
    'any.required': 'The field settled is not present but it is required'
  }),
  settlementDate: Joi.date().required().messages({
    'date.base': 'settlementDate should be a valid date',
    'any.required': 'The field settlementDate is not present but it is required'
  }),
  value: Joi.number().integer().required().messages({
    'number.base': 'value should be a type of number',
    'number.integer': 'value should be an integer',
    'any.required': 'The field value is not present but it is required'
  }),
  paymentValue: Joi.number().integer().required().messages({
    'number.base': 'paymentValue should be a type of number',
    'number.integer': 'paymentValue should be an integer',
    'any.required': 'The field paymentValue is not present but it is required'
  }),
  lastSettlementValue: Joi.number().integer().required().messages({
    'number.base': 'lastSettlementValue should be a type of number',
    'number.integer': 'lastSettlementValue should be an integer',
    'any.required': 'The field lastSettlementValue is not present but it is required'
  })
}).required().messages({
  'object.base': 'The input should be an object',
  'any.required': 'The input is not present but it is required'
})
