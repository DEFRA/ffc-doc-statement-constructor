const { Joi, constants, numberSchema } = require('../../utility/common-schema-fields')

module.exports = Joi.object({
  applicationReference: Joi.number().integer().required().messages({
    'number.base': 'applicationId should be a type of number',
    'number.integer': 'applicationId should be an integer',
    'any.required': 'The field applicationId is not present but it is required'
  }),
  calculationReference: numberSchema('calculationReference'),
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
  paymentBand1: Joi.string().required().messages({
    'string.base': 'paymentBand1 should be a type of string',
    'any.required': 'The field paymentBand1 is not present but it is required'
  }),
  paymentBand2: Joi.string().required().messages({
    'string.base': 'paymentBand2 should be a type of string',
    'any.required': 'The field paymentBand2 is not present but it is required'
  }),
  paymentBand3: Joi.string().required().messages({
    'string.base': 'paymentBand2 should be a type of string',
    'any.required': 'The field paymentBand3 is not present but it is required'
  }),
  paymentBand4: Joi.string().required().messages({
    'string.base': 'paymentBand4 should be a type of string',
    'any.required': 'The field paymentBand4 is not present but it is required'
  }),
  percentageReduction1: Joi.string().required().messages({
    'string.base': 'percentageReduction1 should be a type of string',
    'any.required': 'The field percentageReduction1 is not present but it is required'
  }),
  percentageReduction2: Joi.string().required().messages({
    'string.base': 'percentageReduction2 should be a type of string',
    'any.required': 'The field percentageReduction2 is not present but it is required'
  }),
  percentageReduction3: Joi.string().required().messages({
    'string.base': 'percentageReduction3 should be a type of string',
    'any.required': 'The field percentageReduction3 is not present but it is required'
  }),
  percentageReduction4: Joi.string().required().messages({
    'string.base': 'percentageReduction4 should be a type of string',
    'any.required': 'The field percentageReduction4 is not present but it is required'
  }),
  progressiveReductions1: Joi.string().required().messages({
    'string.base': 'progressiveReductions1 should be a type of string',
    'any.required': 'The field progressiveReductions1 is not present but it is required'
  }),
  progressiveReductions2: Joi.string().required().messages({
    'string.base': 'progressiveReductions2 should be a type of string',
    'any.required': 'The field progressiveReductions2 is not present but it is required'
  }),
  progressiveReductions3: Joi.string().required().messages({
    'string.base': 'progressiveReductions3 should be a type of string',
    'any.required': 'The field progressiveReductions3 is not present but it is required'
  }),
  progressiveReductions4: Joi.string().required().messages({
    'string.base': 'progressiveReductions4 should be a type of string',
    'any.required': 'The field progressiveReductions4 is not present but it is required'
  }),
  referenceAmount: Joi.string().required().messages({
    'string.base': 'referenceAmount should be a type of string',
    'any.required': 'The field referenceAmount is not present but it is required'
  }),
  totalProgressiveReduction: Joi.string().required().messages({
    'string.base': 'totalProgressiveReduction should be a type of string',
    'any.required': 'The field totalProgressiveReduction is not present but it is required'
  }),
  totalDelinkedPayment: Joi.string().required().messages({
    'string.base': 'totalDelinkedPayment should be a type of string',
    'any.required': 'The field totalDelinkedPayment is not present but it is required'
  }),
  paymentAmountCalculated: Joi.string().required().messages({
    'string.base': 'paymentAmountCalculated should be a type of string',
    'any.required': 'The field paymentAmountCalculated is not present but it is required'
  }),
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
