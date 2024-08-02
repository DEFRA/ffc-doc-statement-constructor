const { Joi, constants, numberSchema } = require('../../utility/common-schema-fields')

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

const paymentBands = Array.from({ length: 4 }, (_, i) => ({
  [`paymentBand${i + 1}`]: createStringField(`paymentBand${i + 1}`)
})).reduce((acc, curr) => ({ ...acc, ...curr }), {})

const percentageReductions = Array.from({ length: 4 }, (_, i) => ({
  [`percentageReduction${i + 1}`]: createStringField(`percentageReduction${i + 1}`)
})).reduce((acc, curr) => ({ ...acc, ...curr }), {})

const progressiveReductions = Array.from({ length: 4 }, (_, i) => ({
  [`progressiveReductions${i + 1}`]: createStringField(`progressiveReductions${i + 1}`)
})).reduce((acc, curr) => ({ ...acc, ...curr }), {})

module.exports = Joi.object({
  applicationReference: Joi.number().integer().required().messages({
    'number.base': 'applicationId should be a type of number',
    'number.integer': 'applicationId should be an integer',
    'any.required': 'The field applicationId is not present but it is required'
  }),
  calculationReference: numberSchema('calculationReference'),
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
  type: Joi.string().required().allow(constants.DELINKEDCALCULATION).messages({
    'string.base': 'type should be a type of string',
    'any.required': 'The field type is not present but it is required',
    'any.only': `type must be : ${constants.DELINKEDCALCULATION}`
  })
})
