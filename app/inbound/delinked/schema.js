const { Joi, constants, numberSchema, stringSchema } = require('../../utility/common-schema-fields')
const { DELINKED } = require('../../constants/types')
const maxChars = 4000
const percentageReductionPattern = /^\d{1,3}\.\d{2}$/
const monetaryPattern = /^\d+\.\d{2}$/

const createStringSchema = (name) => stringSchema(name, maxChars)

const createPatternSchema = (name, pattern) => Joi.string().pattern(pattern).required().messages({
  'string.base': `${name} should be a type of string`,
  'string.empty': `${name} cannot be an empty field`,
  'string.pattern.base': `${name} must match the required pattern: ${pattern}`,
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
  percentageReduction1: createPatternSchema('percentageReduction1', percentageReductionPattern),
  percentageReduction2: createPatternSchema('percentageReduction2', percentageReductionPattern),
  percentageReduction3: createPatternSchema('percentageReduction3', percentageReductionPattern),
  percentageReduction4: createPatternSchema('percentageReduction4', percentageReductionPattern)
}

const progressiveReductions = {
  progressiveReductions1: createPatternSchema('progressiveReductions1', monetaryPattern),
  progressiveReductions2: createPatternSchema('progressiveReductions2', monetaryPattern),
  progressiveReductions3: createPatternSchema('progressiveReductions3', monetaryPattern),
  progressiveReductions4: createPatternSchema('progressiveReductions4', monetaryPattern)
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
