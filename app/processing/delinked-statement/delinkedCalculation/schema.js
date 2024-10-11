const { Joi, constants, numberSchema, stringSchema } = require('../../../utility/common-schema-fields')
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

const createSchemaObject = (names, schemaCreator) => {
  return names.reduce((acc, name) => {
    acc[name] = schemaCreator(name)
    return acc
  }, {})
}

const paymentBandNames = ['paymentBand1', 'paymentBand2', 'paymentBand3', 'paymentBand4']
const percentageReductionNames = ['percentageReduction1', 'percentageReduction2', 'percentageReduction3', 'percentageReduction4']
const progressiveReductionNames = ['progressiveReductions1', 'progressiveReductions2', 'progressiveReductions3', 'progressiveReductions4']

const paymentBands = createSchemaObject(paymentBandNames, createStringSchema)
const percentageReductions = createSchemaObject(percentageReductionNames, createStringSchema)
const progressiveReductions = createSchemaObject(progressiveReductionNames, createProgressiveReductionSchema)

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
  })
})
