const Joi = require('joi')

module.exports = Joi.object({
  invoiceNumber: Joi.string().required().messages({
    'string.base': 'invoiceNumber should be a type of string',
    'any.required': 'The field invoiceNumber is not present but it is required'
  }),
  dueDate: Joi.date().required().messages({
    'date.base': 'dueDate should be a valid date',
    'any.required': 'The field dueDate is not present but it is required'
  }),
  value: Joi.number().integer().required().messages({
    'number.base': 'value should be a type of number',
    'number.integer': 'value should be an integer',
    'any.required': 'The field value is not present but it is required'
  }),
  period: Joi.string().required().messages({
    'string.base': 'period should be a type of string',
    'any.required': 'The field period is not present but it is required'
  })
}).required().messages({
  'object.base': 'The input should be an object',
  'any.required': 'The input is not present but it is required'
})
