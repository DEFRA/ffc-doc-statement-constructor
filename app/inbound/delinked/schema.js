const { Joi, constants, numberSchema, stringSchema } = require('../../utility/common-schema-fields')
const { DELINKED } = require('../../constants/types')
const maxChars = 4000
const percentageReductionPattern = /^\d{1,3}\.\d{2}$/
const monetaryPattern = /^\d+\.\d{2}$/

const createStringSchema = (name, pattern) => stringSchema(name, maxChars, pattern)

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
  percentageReduction1: createStringSchema('percentageReduction1', percentageReductionPattern),
  percentageReduction2: createStringSchema('percentageReduction2', percentageReductionPattern),
  percentageReduction3: createStringSchema('percentageReduction3', percentageReductionPattern),
  percentageReduction4: createStringSchema('percentageReduction4', percentageReductionPattern)
}

const progressiveReductions = {
  progressiveReductions1: createStringSchema('progressiveReductions1', monetaryPattern),
  progressiveReductions2: createStringSchema('progressiveReductions2', monetaryPattern),
  progressiveReductions3: createStringSchema('progressiveReductions3', monetaryPattern),
  progressiveReductions4: createStringSchema('progressiveReductions4', monetaryPattern)
}

module.exports = Joi.object({
  calculationId: numberSchema('calculationId'),
  applicationId: numberSchema('applicationId'),
  sbi: createNumberSchemaWithMessages('sbi', constants.minSbi, constants.maxSbi),
  frn: createNumberSchemaWithMessages('frn', constants.minFrn, constants.maxFrn),
  ...paymentBands,
  ...percentageReductions,
  ...progressiveReductions,
  referenceAmount: createStringSchema('referenceAmount', monetaryPattern),
  totalProgressiveReduction: createStringSchema('totalProgressiveReduction', monetaryPattern),
  totalDelinkedPayment: createStringSchema('totalDelinkedPayment', monetaryPattern),
  paymentAmountCalculated: createStringSchema('paymentAmountCalculated', monetaryPattern),
  updated: Joi.date().required().messages({
    'date.base': 'updated should be a type of date',
    'any.required': 'The field updated is not present but it is required'
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
