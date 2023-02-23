const Joi = require('joi')

module.exports = Joi.object({
  calculationId: Joi.number().integer().required(),
  calculationDate: Joi.date().required(),
  invoiceNumber: Joi.string().required(),
  paymentRequestId: Joi.number().integer().required(),
  sbi: Joi.number().integer().required()
}).required()
