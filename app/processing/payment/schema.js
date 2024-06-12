const Joi = require('joi')

module.exports = Joi.object({
  invoiceNumber: Joi.string().required(),
  dueDate: Joi.date().required(),
  value: Joi.number().integer().required(),
  period: Joi.string().required()
}).required()
