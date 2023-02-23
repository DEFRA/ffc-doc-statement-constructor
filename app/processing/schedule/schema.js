const Joi = require('joi')

module.exports = Joi.object({
  scheduleId: Joi.number().integer().required(),
  settlementId: Joi.number().integer(),
  paymentRequestId: Joi.number().integer()
}).required().or('settlementId', 'paymentRequestId')
