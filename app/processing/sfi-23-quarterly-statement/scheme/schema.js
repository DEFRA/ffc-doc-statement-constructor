const Joi = require('joi')

const number50 = 50
const number450 = 450

module.exports = Joi.object({
  code: Joi.string().max(number50).required(),
  name: Joi.string().max(number450).required()
})
