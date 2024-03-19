const Joi = require('joi')

const number50 = 50
const number450 = 450

module.exports = Joi.object({
  schemeCode: Joi.string().max(number50).required(),
  schemeName: Joi.string().max(number450).required()
})
