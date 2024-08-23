const { Joi, constants, numberSchema, stringSchema, dateSchema, precisionSchema } = require('../../utility/common-schema-fields')

module.exports = Joi.object({
  calculationReference: numberSchema('calculationReference'),
  sbi: Joi.number().integer().min(constants.minSbi).max(constants.maxSbi).required().messages({
    'number.base': 'sbi should be a type of number',
    'number.integer': 'sbi should be an integer',
    'number.min': `sbi should have a minimum value of ${constants.minSbi}`,
    'number.max': `sbi should have a maximum value of ${constants.maxSbi}`,
    'any.required': 'The field sbi is not present but it is required'
  }),
  frn: Joi.number().integer().min(constants.minFrn).max(constants.maxFrn).required().messages({
    'number.base': 'frn should be a type of number',
    'number.integer': 'frn should be an integer',
    'number.min': `frn should have a minimum value of ${constants.minFrn}`,
    'number.max': `frn should have a maximum value of ${constants.maxFrn}`,
    'any.required': 'The field frn is not present but it is required'
  }),
  agreementNumber: numberSchema('agreementNumber'),
  claimReference: numberSchema('claimReference'),
  schemeType: stringSchema('schemeType', constants.number50),
  calculationDate: dateSchema('calculationDate'),
  invoiceNumber: stringSchema('invoiceNumber', constants.number20),
  agreementStart: dateSchema('agreementStart'),
  agreementEnd: dateSchema('agreementEnd'),
  totalAdditionalPayments: precisionSchema('totalAdditionalPayments', constants.number15),
  totalActionPayments: precisionSchema('totalActionPayments', constants.number15),
  totalPayments: precisionSchema('totalPayments', constants.number15),
  updated: dateSchema('updated'),
  datePublished: Joi.date().allow(null).messages({
    'date.base': 'datePublished should be a type of date'
  }),
  type: Joi.string().required().valid(constants.TOTAL).messages({
    'string.base': 'type should be a type of string',
    'any.required': 'The field type is not present but it is required',
    'any.only': `type must be ${constants.TOTAL}`
  }),
  actions: Joi.array().items(Joi.object({
    actionReference: numberSchema('actionReference'),
    calculationReference: numberSchema('calculationReference'),
    actionCode: stringSchema('actionCode', constants.number5),
    actionName: stringSchema('actionName', constants.number100),
    fundingCode: stringSchema('fundingCode', constants.number5),
    rate: stringSchema('rate', constants.number100),
    landArea: Joi.string().max(constants.number18).messages({
      'string.base': 'landArea should be a type of string',
      'string.max': `landArea should have a maximum length of ${constants.number18}`
    }),
    uom: Joi.string().max(constants.number10).messages({
      'string.base': 'uom should be a type of string',
      'string.max': `uom should have a maximum length of ${constants.number10}`
    }),
    annualValue: stringSchema('annualValue', constants.number50),
    quarterlyValue: stringSchema('quarterlyValue', constants.number15),
    overDeclarationPenalty: precisionSchema('overDeclarationPenalty', constants.number15),
    quarterlyPaymentAmount: stringSchema('quarterlyPaymentAmount', constants.number15),
    groupName: stringSchema('groupName', constants.number100)
  })).min(1).optional().messages({
    'array.base': 'actions should be a type of array',
    'array.min': 'actions array should have a minimum length of 1'
  })
}).required().messages({
  'object.base': 'The input should be an object',
  'any.required': 'The input is not present but it is required'
})
