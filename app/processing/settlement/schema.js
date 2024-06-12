const Joi = require('joi')

module.exports = Joi.object({
  paymentRequestId: Joi.number().integer().required(),
  invoiceNumber: Joi.string().required(),
  reference: Joi.string().required(),
  settled: Joi.boolean().required(),
  settlementDate: Joi.date().required(),
  value: Joi.number().integer().required(),
  paymentValue: Joi.number().integer().required(),
  lastSettlementValue: Joi.number().integer().required()
}).required()
