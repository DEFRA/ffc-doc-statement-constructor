const Joi = require('joi')
const DAX = 'dax'

const number30 = 30
const number200 = 200

module.exports = Joi.object({
  paymentReference: Joi.string().max(number30).required(),
  calculationRefence: Joi.number().integer().allow(null),
  paymentPeriod: Joi.string().max(number200).required(),
  paymentAmount: Joi.number().required(),
  transactionDate: Joi.date().required(),
  datePublished: Joi.date().allow(null),
  type: Joi.string().required().allow(DAX)
})
