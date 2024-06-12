const Joi = require('joi').extend(require('@joi/date'))

const { DAX_CODES } = require('../../constants/schedules')

module.exports = Joi.object({
  paymentRequestId: Joi.number().integer().required().messages({
    'number.base': 'paymentRequestId should be a type of number',
    'number.integer': 'paymentRequestId should be an integer',
    'any.required': 'The field paymentRequestId is not present but it is required'
  }),
  agreementNumber: Joi.string().required().messages({
    'string.base': 'agreementNumber should be a type of string',
    'any.required': 'The field agreementNumber is not present but it is required'
  }),
  correlationId: Joi.string().required().messages({
    'string.base': 'correlationId should be a type of string',
    'any.required': 'The field correlationId is not present but it is required'
  }),
  dueDate: Joi.date().format('D/M/YYYY').required().messages({
    'date.base': 'dueDate should be a valid date',
    'date.format': 'dueDate should be in D/M/YYYY format',
    'any.required': 'The field dueDate is not present but it is required'
  }),
  invoiceNumber: Joi.string().required().messages({
    'string.base': 'invoiceNumber should be a type of string',
    'any.required': 'The field invoiceNumber is not present but it is required'
  }),
  marketingYear: Joi.number().integer().required().messages({
    'number.base': 'marketingYear should be a type of number',
    'number.integer': 'marketingYear should be an integer',
    'any.required': 'The field marketingYear is not present but it is required'
  }),
  originalValue: Joi.number().integer().optional().messages({
    'number.base': 'originalValue should be a type of number',
    'number.integer': 'originalValue should be an integer'
  }),
  paymentRequestNumber: Joi.number().required().messages({
    'number.base': 'paymentRequestNumber should be a type of number',
    'any.required': 'The field paymentRequestNumber is not present but it is required'
  }),
  schedule: Joi.string().optional().allow(null).default(DAX_CODES.QUARTERLY).messages({
    'string.base': 'schedule should be a type of string'
  }),
  sourceSystem: Joi.string().required().messages({
    'string.base': 'sourceSystem should be a type of string',
    'any.required': 'The field sourceSystem is not present but it is required'
  }),
  value: Joi.number().integer().required().messages({
    'number.base': 'value should be a type of number',
    'number.integer': 'value should be an integer',
    'any.required': 'The field value is not present but it is required'
  })
}).required().messages({
  'object.base': 'The input should be an object',
  'any.required': 'The input is not present but it is required'
})
