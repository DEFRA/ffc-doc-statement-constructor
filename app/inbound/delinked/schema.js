const { Joi, constants, numberSchema } = require('../../utility/common-schema-fields')
const { DELINKED } = require('../../constants/types')

const createStringField = (fieldName) => Joi.string().required().messages({
  'string.base': `${fieldName} should be a type of string`,
  'any.required': `The field ${fieldName} is not present but it is required`
})

const createNumberField = (fieldName, min, max) => Joi.number().integer().min(min).max(max).required().messages({
  'number.base': `${fieldName} should be a type of number`,
  'number.integer': `${fieldName} should be an integer`,
  'number.min': `${fieldName} should have a minimum value of ${min}`,
  'number.max': `${fieldName} should have a maximum value of ${max}`,
  'any.required': `The field ${fieldName} is not present but it is required`
})

const paymentBands = {
  paymentBand1: createStringField('paymentBand1'),
  paymentBand2: createStringField('paymentBand2'),
  paymentBand3: createStringField('paymentBand3'),
  paymentBand4: createStringField('paymentBand4')
}

const percentageReductions = {
  percentageReduction1: createStringField('percentageReduction1'),
  percentageReduction2: createStringField('percentageReduction2'),
  percentageReduction3: createStringField('percentageReduction3'),
  percentageReduction4: createStringField('percentageReduction4')
}

const progressiveReductions = {
  progressiveReductions1: createStringField('progressiveReductions1'),
  progressiveReductions2: createStringField('progressiveReductions2'),
  progressiveReductions3: createStringField('progressiveReductions3'),
  progressiveReductions4: createStringField('progressiveReductions4')
}

module.exports = Joi.object({
  calculationReference: numberSchema('calculationReference'),
  applicationReference: numberSchema('applicationReference'),
  sbi: createNumberField('sbi', constants.minSbi, constants.maxSbi),
  frn: createNumberField('frn', constants.minFrn, constants.maxFrn),
  ...paymentBands,
  ...percentageReductions,
  ...progressiveReductions,
  referenceAmount: createStringField('referenceAmount'),
  totalProgressiveReduction: createStringField('totalProgressiveReduction'),
  totalDelinkedPayment: createStringField('totalDelinkedPayment'),
  paymentAmountCalculated: createStringField('paymentAmountCalculated'),
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
