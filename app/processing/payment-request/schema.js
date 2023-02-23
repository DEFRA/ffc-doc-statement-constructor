const Joi = require('joi').extend(require('@joi/date'))

const { DAX_CODES } = require('../../constants/schedules')

module.exports = Joi.object({
  paymentRequestId: Joi.number().integer().required(),
  agreementNumber: Joi.string().required(),
  correlationId: Joi.string().required(),
  dueDate: Joi.date().format('D/M/YYYY').required(),
  invoiceNumber: Joi.string().required(),
  marketingYear: Joi.number().integer().required(),
  originalValue: Joi.number().integer().optional(),
  paymentRequestNumber: Joi.number().required(),
  schedule: Joi.string().optional().allow(null).default(DAX_CODES.QUARTERLY),
  value: Joi.number().integer().required()
}).required()
