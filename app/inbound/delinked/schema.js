const { Joi, constants, numberSchema, stringSchema } = require('../../utility/common-schema-fields')
const { DELINKED } = require('../../constants/types')

const paymentBands = {
  paymentBand1: stringSchema('paymentBand1', 255),
  paymentBand2: stringSchema('paymentBand2', 255),
  paymentBand3: stringSchema('paymentBand3', 255),
  paymentBand4: stringSchema('paymentBand4', 255)
}

const percentageReductions = {
  percentageReduction1: stringSchema('percentageReduction1', 255),
  percentageReduction2: stringSchema('percentageReduction2', 255),
  percentageReduction3: stringSchema('percentageReduction3', 255),
  percentageReduction4: stringSchema('percentageReduction4', 255)
}

const progressiveReductions = {
  progressiveReductions1: Joi.string().allow(null).messages({
    'string.base': 'progressiveReductions1 should be a type of string'
  }),
  progressiveReductions2: Joi.string().allow(null).messages({
    'string.base': 'progressiveReductions2 should be a type of string'
  }),
  progressiveReductions3: Joi.string().allow(null).messages({
    'string.base': 'progressiveReductions3 should be a type of string'
  }),
  progressiveReductions4: Joi.string().allow(null).messages({
    'string.base': 'progressiveReductions4 should be a type of string'
  })
}

module.exports = Joi.object({
  calculationId: numberSchema('calculationId'),
  applicationId: numberSchema('applicationId'),
  calculationReference: numberSchema('calculationReference').optional(),
  applicationReference: numberSchema('applicationReference').optional(),
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
  ...paymentBands,
  ...percentageReductions,
  ...progressiveReductions,
  referenceAmount: stringSchema('referenceAmount', 255),
  totalProgressiveReduction: stringSchema('totalProgressiveReduction', 255),
  totalDelinkedPayment: stringSchema('totalDelinkedPayment', 255),
  paymentAmountCalculated: stringSchema('paymentAmountCalculated', 255),
  datePublished: Joi.date().allow(null).messages({
    'date.base': 'datePublished should be a type of date',
    'date.strict': 'datePublished should be a type of date or null'
  }),
  type: Joi.string().required().valid(DELINKED).messages({
    'string.base': 'type should be a type of string',
    'any.required': 'The field type is not present but it is required',
    'any.only': `type must be : ${DELINKED}`
  })
})
