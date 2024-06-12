const Joi = require('joi')

const number50 = 50
const number450 = 450

module.exports = Joi.object({
  code: Joi.string().max(number50).required().messages({
    'string.base': 'code should be a type of string',
    'string.max': `code should have a maximum length of ${number50}`,
    'any.required': 'The field code is not present but it is required'
  }),
  name: Joi.string().max(number450).required().messages({
    'string.base': 'name should be a type of string',
    'string.max': `name should have a maximum length of ${number450}`,
    'any.required': 'The field name is not present but it is required'
  })
}).required().messages({
  'object.base': 'The input should be an object',
  'any.required': 'The input is not present but it is required'
})
