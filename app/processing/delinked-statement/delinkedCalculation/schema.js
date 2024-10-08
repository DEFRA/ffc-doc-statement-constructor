const { Joi, constants, numberSchema, stringSchema } = require('../../../utility/common-schema-fields')
const { DELINKED } = require('../../../constants/types')
const maxChars = 4000

const createStringSchema = (name) => stringSchema(name, maxChars)

const createProgressiveReductionSchema = (name) => Joi.string().allow(null).messages({
  'string.base': `${name} should be a type of string`
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
  percentageReduction1: createStringSchema('percentageReduction1'),
  percentageReduction2: createStringSchema('percentageReduction2'),
  percentageReduction3: createStringSchema('percentageReduction3'),
  percentageReduction4: createStringSchema('percentageReduction4')
}

const progressiveReductions = {
  progressiveReductions1: createProgressiveReductionSchema('progressiveReductions1'),
  progressiveReductions2: createProgressiveReductionSchema('progressiveReductions2'),
  progressiveReductions3: createProgressiveReductionSchema('progressiveReductions3'),
  progressiveReductions4: createProgressiveReductionSchema('progressiveReductions4')
}

module.exports = Joi.object({
  calculationId: numberSchema('calculationId'),
  applicationId: numberSchema('applicationId'),
  calculationReference: numberSchema('calculationReference').optional(),
  applicationReference: numberSchema('applicationReference').optional(),
  sbi: createNumberSchemaWithMessages('sbi', constants.minSbi, constants.maxSbi),
  frn: createNumberSchemaWithMessages('frn', constants.minFrn, constants.maxFrn),
  ...paymentBands,
  ...percentageReductions,
  ...progressiveReductions,
  referenceAmount: createStringSchema('referenceAmount'),
  totalProgressiveReduction: createStringSchema('totalProgressiveReduction'),
  totalDelinkedPayment: createStringSchema('totalDelinkedPayment'),
  paymentAmountCalculated: createStringSchema('paymentAmountCalculated'),
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
