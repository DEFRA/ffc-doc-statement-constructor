const Joi = require('joi')

const constants = {
  minSbi: 105000000,
  maxSbi: 999999999,
  minFrn: 1000000000,
  maxFrn: 9999999999,
  number8: 8,
  number30: 30,
  number160: 160,
  number200: 200,
  number240: 240,
  number260: 260,
  number4000: 4000,
  year2023: 2023,
  year2024: 2024,
  year2025: 2025,
  year2050: 2050
}

const messages = {
  numberBase: (field) => `${field} should be a type of number`,
  integer: (field) => `${field} should be an integer`,
  required: (field) => `The field ${field} is not present but it is required`,
  stringBase: (field) => `${field} should be a type of string`,
  stringMax: (field, max) => `${field} should have a maximum length of ${max}`
}

const numberSchema = (field) => Joi.number().integer().required().messages({
  'number.base': messages.numberBase(field),
  'number.integer': messages.integer(field),
  'any.required': messages.required(field)
})

const stringSchema = (field, max, pattern) => {
  let schema = Joi.string().required().messages({
    'string.base': messages.stringBase(field),
    'any.required': messages.required(field)
  })
  if (pattern) {
    schema = schema.pattern(pattern).messages({
      'string.pattern.base': `${field} is not in the correct format`
    })
  }
  if (max !== undefined && !pattern) {
    schema = schema.max(max).messages({
      'string.max': messages.stringMax(field, max)
    })
  }
  return schema
}

const emailSchema = (field, max) => {
  let schema = Joi.string().optional().allow(null, '').messages({
    'string.base': messages.stringBase(field)
  })
  if (max !== undefined) {
    schema = schema.max(max).messages({
      'string.max': messages.stringMax(field, max)
    })
    return schema
  } else {
    return schema
  }
}

const percentagePattern = /^\d{1,3}\.\d{2}$/
const monetaryPattern = /^\d+\.\d{2}$/

const createStringSchema = (name, chars, pattern) => stringSchema(name, chars, pattern)
const createEmailSchema = (name, chars) => emailSchema(name, chars)

const createProgressiveReductionSchema = (name) => Joi.string().pattern(monetaryPattern).required().messages({
  'string.base': `${name} should be a type of string`,
  'string.pattern.base': `${name} should adhere to the pattern ${monetaryPattern}`,
  'any.required': `The field ${name} is not present but it is required`
})

const createNumberSchemaWithMessages = (name, min, max) => Joi.number().integer().min(min).max(max).required().messages({
  'number.base': `${name} should be a type of number`,
  'number.integer': `${name} should be an integer`,
  'number.min': `${name} should have a minimum value of ${min}`,
  'number.max': `${name} should have a maximum value of ${max}`,
  'any.required': `The field ${name} is not present but it is required`
})

const createAddressSchema = (name) => Joi.string().allow(null, '').max(constants.number240).messages({
  'string.base': `${name} should be a type of string`,
  'string.max': `${name} should be no more than ${constants.number240} characters`
})

const paymentBands = {
  paymentBand1: createStringSchema('paymentBand1', constants.number4000),
  paymentBand2: createStringSchema('paymentBand2', constants.number4000),
  paymentBand3: createStringSchema('paymentBand3', constants.number4000),
  paymentBand4: createStringSchema('paymentBand4', constants.number4000)
}

const percentageReductions = {
  percentageReduction1: createStringSchema('percentageReduction1', null, percentagePattern),
  percentageReduction2: createStringSchema('percentageReduction2', null, percentagePattern),
  percentageReduction3: createStringSchema('percentageReduction3', null, percentagePattern),
  percentageReduction4: createStringSchema('percentageReduction4', null, percentagePattern)
}

const progressiveReductions = {
  progressiveReductions1: createProgressiveReductionSchema('progressiveReductions1'),
  progressiveReductions2: createProgressiveReductionSchema('progressiveReductions2'),
  progressiveReductions3: createProgressiveReductionSchema('progressiveReductions3'),
  progressiveReductions4: createProgressiveReductionSchema('progressiveReductions4')
}

module.exports = Joi.object({
  address: Joi.object({
    line1: createAddressSchema('line1'),
    line2: createAddressSchema('line2'),
    line3: createAddressSchema('line3'),
    line4: createAddressSchema('line4'),
    line5: createAddressSchema('line5'),
    postcode: createStringSchema('postcode', constants.number8)
  }),
  businessName: createStringSchema('businessName', constants.number160),
  email: createEmailSchema('email', constants.number260),
  frn: createNumberSchemaWithMessages('frn', constants.minFrn, constants.maxFrn),
  sbi: createNumberSchemaWithMessages('sbi', constants.minSbi, constants.maxSbi),
  paymentReference: createStringSchema('paymentReference', constants.number30),
  marketingYear: Joi.number().integer().min(constants.year2023).max(constants.year2050).required().messages({
    'number.base': 'Marketing year should be a type of number',
    'number.integer': 'Marketing year should be an integer',
    'any.required': 'The field marketing year is not present but it is required',
    'number.min': 'Marketing year should have a minimum value of 2023',
    'number.max': 'Marketing year should have a maximum value of 2050'
  }),
  calculationId: numberSchema('calculationId'),
  paymentPeriod: createStringSchema('paymentPeriod', constants.number200),
  paymentAmount: createStringSchema('paymentAmount', null, monetaryPattern),
  transactionDate: Joi.date().required().iso(),
  applicationId: numberSchema('applicationId'),
  ...paymentBands,
  ...percentageReductions,
  ...progressiveReductions,
  referenceAmount: createStringSchema('referenceAmount', null, monetaryPattern),
  totalProgressiveReduction: createStringSchema('totalProgressiveReduction', null, monetaryPattern),
  totalDelinkedPayment: createStringSchema('totalDelinkedPayment', null, monetaryPattern),
  paymentAmountCalculated: createStringSchema('paymentAmountCalculated', null, monetaryPattern),
  scheme: Joi.object({
    name: Joi.string().required().valid('Delinked Payment Statement').messages({
      'string.base': 'scheme name should be a type of string',
      'any.required': 'The field scheme name is not present but it is required',
      'any.only': 'Scheme name must be Delinked Payment Statement'
    }),
    shortName: Joi.string().required().valid('DP').messages({
      'string.base': 'scheme short name should be a type of string',
      'any.required': 'The field scheme short name is not present but it is required',
      'any.only': 'Scheme short name must be DP'
    }),
    year: Joi.number().integer().valid(constants.year2024, constants.year2025).messages({
      'number.base': 'Year should be a type of number',
      'number.integer': 'Year should be an integer',
      'any.required': 'The field year is not present but it is required',
      'any.only': 'Year must be either 2024 or 2025'
    })
  }),
  previousPaymentCount: numberSchema('previousPaymentCount'),
  documentReference: numberSchema('documentReference'),
  excludedFromNotify: Joi.boolean().required().messages({
    'boolean.base': 'Excluded from notify must be a boolean',
    'any.required': 'Excluded from notify is required'
  })
})
