const Joi = require('joi')

module.exports = Joi.object({
  scheduleId: Joi.number().integer().required().messages({
    'number.base': 'scheduleId should be a type of number',
    'number.integer': 'scheduleId should be an integer',
    'any.required': 'The field scheduleId is not present but it is required'
  }),
  settlementId: Joi.number().integer().messages({
    'number.base': 'settlementId should be a type of number',
    'number.integer': 'settlementId should be an integer'
  }),
  paymentRequestId: Joi.number().integer().messages({
    'number.base': 'paymentRequestId should be a type of number',
    'number.integer': 'paymentRequestId should be an integer'
  })
}).required().or('settlementId', 'paymentRequestId').messages({
  'object.base': 'The input should be an object',
  'any.required': 'The input is not present but it is required',
  'object.missing': 'Either settlementId or paymentRequestId must be present'
})
