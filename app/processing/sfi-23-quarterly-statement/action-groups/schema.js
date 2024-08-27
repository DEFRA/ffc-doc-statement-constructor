const { Joi, constants, numberSchema, stringSchema, precisionSchema } = require('../../../utility/common-schema-fields')

module.exports = Joi.array().items(
  Joi.object({
    actionReference: numberSchema('actionReference'),
    calculationReference: numberSchema('calculationReference'),
    actionCode: stringSchema('actionCode', constants.number5),
    actionName: stringSchema('actionName', constants.number100),
    fundingCode: stringSchema('fundingCode', constants.number5),
    rate: stringSchema('rate', constants.number100),
    landArea: Joi.string().max(constants.number18).allow('', null).optional().messages({
      'string.base': 'landArea should be a type of string',
      'string.max': `landArea should have a maximum length of ${constants.number18}`
    }),
    uom: Joi.string().max(constants.number10).allow('', null).optional().messages({
      'string.base': 'uom should be a type of string',
      'string.max': `uom should have a maximum length of ${constants.number10}`
    }),
    annualValue: stringSchema('annualValue', constants.number50),
    quarterlyValue: stringSchema('quarterlyValue', constants.number15),
    overDeclarationPenalty: precisionSchema('overDeclarationPenalty', constants.number15),
    quarterlyPaymentAmount: stringSchema('quarterlyPaymentAmount', constants.number15),
    groupName: stringSchema('groupName', constants.number100)
  })
).optional().messages({
  'array.base': 'The input should be an array',
  'array.min': 'The array should have at least 1 item',
  'any.required': 'The array is not present but it is required'
})
