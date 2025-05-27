const { Joi, stringSchema, numberSchema, dateSchema, constants } = require('../../../utility/common-schema-fields')
const marketingYearMin = 2023
const marketingYearMax = 2050

module.exports = Joi.object({
  paymentReference: stringSchema('paymentReference', constants.number30),
  calculationId: numberSchema('calculationId'),
  paymentPeriod: stringSchema('paymentPeriod', constants.number200).allow('', null).optional(),
  marketingYear: numberSchema().integer().min(marketingYearMin).max(marketingYearMax).required(),
  paymentAmount: numberSchema('paymentAmount'),
  transactionDate: dateSchema('transactionDate')
}).required().messages({
  'object.base': 'The input should be an object',
  'any.required': 'The input is not present but it is required'
})
