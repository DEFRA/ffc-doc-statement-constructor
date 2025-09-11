const { Joi, constants, numberSchema, stringSchema } = require('../../utility/common-schema-fields')
const { DELINKED } = require('../../constants/types')
const maxChars = 4000

const createStringSchema = (name) => stringSchema(name, maxChars)

const createMonetarySchema = (name) => Joi.string().pattern(/^\d+\.\d{2}$/).required().messages({
  'string.base': `${name} should be a type of string`,
  'string.empty': `${name} cannot be an empty field`,
  'string.pattern.base': `${name} must be in monetary format with 2 decimal places`,
  'any.required': `The field ${name} is not present but it is required`
})

const createPercentageSchema = (name) => Joi.string().pattern(/^\d{1,3}\.\d{2}$/).required().messages({
  'string.base': `${name} should be a type of string`,
  'string.empty': `${name} cannot be an empty field`,
  'string.pattern.base': `${name} must be a a valid percentage with 2 decimal places`,
  'any.required': `The field ${name} is not present but it is required`
})

const createNumberSchemaWithMessages = (name, min, max) => Joi.number().integer().min(min).max(max).required().messages({
  'number.base': `${name} should be a type of number`,
  'number.integer': `${name} should be an integer`,
  'number.min': `${name} should have a minimum value of ${min}`,
  'number.max': `${name} should have a maximum value of ${max}`,
  'any.required': `The field ${name} is not present but it is required`
})

const paymentBands = {
  paymentBand1: createStringSchema('paymentBand1'),
  paymentBand2: createStringSchema('paymentBand2'),
  paymentBand3: createStringSchema('paymentBand3'),
  paymentBand4: createStringSchema('paymentBand4')
}

const percentageReductions = {
  percentageReduction1: createPercentageSchema('percentageReduction1'),
  percentageReduction2: createPercentageSchema('percentageReduction2'),
  percentageReduction3: createPercentageSchema('percentageReduction3'),
  percentageReduction4: createPercentageSchema('percentageReduction4')
}

const progressiveReductions = {
  progressiveReductions1: createMonetarySchema('progressiveReductions1'),
  progressiveReductions2: createMonetarySchema('progressiveReductions2'),
  progressiveReductions3: createMonetarySchema('progressiveReductions3'),
  progressiveReductions4: createMonetarySchema('progressiveReductions4')
}

module.exports = Joi.object({
  calculationId: numberSchema('calculationId'),
  applicationId: numberSchema('applicationId'),
  sbi: createNumberSchemaWithMessages('sbi', constants.minSbi, constants.maxSbi),
  frn: createNumberSchemaWithMessages('frn', constants.minFrn, constants.maxFrn),
  ...paymentBands,
  ...percentageReductions,
  ...progressiveReductions,
  referenceAmount: createMonetarySchema('referenceAmount'),
  totalProgressiveReduction: createMonetarySchema('totalProgressiveReduction'),
  totalDelinkedPayment: createMonetarySchema('totalDelinkedPayment'),
  paymentAmountCalculated: createMonetarySchema('paymentAmountCalculated'),
  updated: Joi.date().optional().allow(null).messages({
    'date.base': 'updated should be a type of date'
  }),
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
