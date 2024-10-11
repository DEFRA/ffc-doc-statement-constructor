const { Joi, stringSchema, dateSchema, constants } = require('../../../utility/common-schema-fields')

const number30 = constants.number30
const number200 = constants.number200

module.exports = Joi.object({
  paymentReference: stringSchema('paymentReference', number30),
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
  transactionDate: dateSchema('transactionDate')
}).required().messages({
  'object.base': 'The input should be an object',
  'any.required': 'The input is not present but it is required'
})
