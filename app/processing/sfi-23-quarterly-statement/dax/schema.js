const Joi = require('joi')
const number30 = 30
const number200 = 200

module.exports = Joi.object({
  paymentReference: Joi.string().max(number30).required(),
  calculationId: Joi.number().integer(),
  paymentPeriod: Joi.string().max(number200).required(),
  paymentAmount: Joi.number().required(),
  transactionDate: Joi.date().required()
})