const { Joi, stringSchema, numberSchema, dateSchema, constants } = require('../../../utility/common-schema-fields')

module.exports = Joi.object({
  paymentReference: stringSchema('paymentReference', constants.number30),
  calculationId: numberSchema('calculationId'),
  paymentPeriod: stringSchema('paymentPeriod', constants.number200).allow('', null).optional(),
  paymentAmount: numberSchema('paymentAmount'),
  transactionDate: dateSchema('transactionDate')
}).required().messages({
  'object.base': 'The input should be an object',
  'any.required': 'The input is not present but it is required'
})
