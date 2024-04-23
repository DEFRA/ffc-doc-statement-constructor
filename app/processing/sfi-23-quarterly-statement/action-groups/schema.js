const Joi = require('joi')
const number5 = 5
const number10 = 10
const number15 = 15
const number18 = 18
const number50 = 50
const number100 = 100

module.exports = Joi.array().items(
  Joi.object({
    actionReference: Joi.number().required(),
    calculationReference: Joi.number().required(),
    actionCode: Joi.string().max(number5).required(),
    actionName: Joi.string().max(number100).required(),
    fundingCode: Joi.string().max(number5).required(),
    rate: Joi.string().required().max(number100).required(),
    landArea: Joi.string().max(number18).allow('', null).optional(),
    uom: Joi.string().max(number10).allow('', null).optional(),
    annualValue: Joi.string().max(number50).required(),
    quarterlyValue: Joi.string().max(number15).required(),
    overDeclarationPenalty: Joi.number().precision(number15).required(),
    quarterlyPaymentAmount: Joi.string().max(number15).required(),
    groupName: Joi.string().max(number100).required()
  })
).min(1).required()
