const Joi = require('joi')

const minSbi = 105000000
const maxSbi = 999999999
const number15 = 15
const number20 = 20
const number50 = 50

module.exports = Joi.object({
  calculationReference: Joi.number().integer().required(),
  agreementNumber: Joi.number().integer().required(),
  claimReference: Joi.number().integer().required(),
  sbi: Joi.number().integer().min(minSbi).max(maxSbi).required(),
  schemeCode: Joi.string().max(number50).required(),
  calculationDate: Joi.date().required(),
  invoiceNumber: Joi.string().max(number20).required(),
  agreementStart: Joi.date().required(),
  agreementEnd: Joi.date().required(),
  totalAdditionalPayments: Joi.number().precision(number15).required(),
  totalActionPayments: Joi.number().precision(number15).required(),
  totalPayments: Joi.number().precision(number15).required()
})
