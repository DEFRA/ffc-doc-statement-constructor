const { Joi, constants, numberSchema, stringSchema, dateSchema, precisionSchema } = require('../../../utility/common-schema-fields')

module.exports = Joi.object({
  calculationReference: numberSchema('calculationReference'),
  agreementNumber: numberSchema('agreementNumber'),
  claimReference: numberSchema('claimReference'),
  sbi: Joi.number().integer().min(constants.minSbi).max(constants.maxSbi).required().messages({
    'number.base': 'sbi should be a type of number',
    'number.integer': 'sbi should be an integer',
    'number.min': `sbi should be greater than or equal to ${constants.minSbi}`,
    'number.max': `sbi should be less than or equal to ${constants.maxSbi}`,
    'any.required': 'The field sbi is not present but it is required'
  }),
  schemeCode: stringSchema('schemeCode', constants.number50),
  calculationDate: dateSchema('calculationDate'),
  invoiceNumber: stringSchema('invoiceNumber', constants.number20),
  agreementStart: dateSchema('agreementStart'),
  agreementEnd: dateSchema('agreementEnd'),
  totalAdditionalPayments: precisionSchema('totalAdditionalPayments', constants.number15),
  totalActionPayments: precisionSchema('totalActionPayments', constants.number15),
  totalPayments: precisionSchema('totalPayments', constants.number15)
}).required().messages({
  'object.base': 'The input should be an object',
  'any.required': 'The input is not present but it is required'
})
