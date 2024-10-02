const { Joi, constants, numberSchema, stringSchema } = require('../../utility/common-schema-fields')
const { DELINKED } = require('../../constants/types')
const maxChars = 4000

const createStringSchema = (name) => stringSchema(name, maxChars)

const createProgressiveReductionSchema = (name) => Joi.string().allow(null).messages({
  'string.base': `${name} should be a type of string`
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
