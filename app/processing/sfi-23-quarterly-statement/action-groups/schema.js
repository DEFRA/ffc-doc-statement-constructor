const Joi = require('joi')
const number5 = 5
const number10 = 10
const number15 = 15
const number18 = 18
const number50 = 50
const number100 = 100

module.exports = Joi.array().items(
  Joi.object({
    actionReference: Joi.number().required().messages({
      'number.base': 'actionReference should be a type of number',
      'any.required': 'The field actionReference is not present but it is required'
    }),
    calculationReference: Joi.number().required().messages({
      'number.base': 'calculationReference should be a type of number',
      'any.required': 'The field calculationReference is not present but it is required'
    }),
    actionCode: Joi.string().max(number5).required().messages({
      'string.base': 'actionCode should be a type of string',
      'string.max': `actionCode should have a maximum length of ${number5}`,
      'any.required': 'The field actionCode is not present but it is required'
    }),
    actionName: Joi.string().max(number100).required().messages({
      'string.base': 'actionName should be a type of string',
      'string.max': `actionName should have a maximum length of ${number100}`,
      'any.required': 'The field actionName is not present but it is required'
    }),
    fundingCode: Joi.string().max(number5).required().messages({
      'string.base': 'fundingCode should be a type of string',
      'string.max': `fundingCode should have a maximum length of ${number5}`,
      'any.required': 'The field fundingCode is not present but it is required'
    }),
    rate: Joi.string().required().max(number100).required().messages({
      'string.base': 'rate should be a type of string',
      'string.max': `rate should have a maximum length of ${number100}`,
      'any.required': 'The field rate is not present but it is required'
    }),
    landArea: Joi.string().max(number18).allow('', null).optional().messages({
      'string.base': 'landArea should be a type of string',
      'string.max': `landArea should have a maximum length of ${number18}`
    }),
    uom: Joi.string().max(number10).allow('', null).optional().messages({
      'string.base': 'uom should be a type of string',
      'string.max': `uom should have a maximum length of ${number10}`
    }),
    annualValue: Joi.string().max(number50).required().messages({
      'string.base': 'annualValue should be a type of string',
      'string.max': `annualValue should have a maximum length of ${number50}`,
      'any.required': 'The field annualValue is not present but it is required'
    }),
    quarterlyValue: Joi.string().max(number15).required().messages({
      'string.base': 'quarterlyValue should be a type of string',
      'string.max': `quarterlyValue should have a maximum length of ${number15}`,
      'any.required': 'The field quarterlyValue is not present but it is required'
    }),
    overDeclarationPenalty: Joi.number().precision(number15).required().messages({
      'number.base': 'overDeclarationPenalty should be a type of number',
      'number.precision': `overDeclarationPenalty should have a maximum precision of ${number15}`,
      'any.required': 'The field overDeclarationPenalty is not present but it is required'
    }),
    quarterlyPaymentAmount: Joi.string().max(number15).required().messages({
      'string.base': 'quarterlyPaymentAmount should be a type of string',
      'string.max': `quarterlyPaymentAmount should have a maximum length of ${number15}`,
      'any.required': 'The field quarterlyPaymentAmount is not present but it is required'
    }),
    groupName: Joi.string().max(number100).required().messages({
      'string.base': 'groupName should be a type of string',
      'string.max': `groupName should have a maximum length of ${number100}`,
      'any.required': 'The field groupName is not present but it is required'
    })
  })
).min(1).required().messages({
  'array.base': 'The input should be an array',
  'array.min': 'The array should have at least 1 item',
  'any.required': 'The array is not present but it is required'
})
