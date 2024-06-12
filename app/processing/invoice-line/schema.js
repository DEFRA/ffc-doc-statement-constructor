const Joi = require('joi')

module.exports = Joi.object({
  value: Joi.number().required().messages({
    'number.base': 'value should be a type of number',
    'any.required': 'The field value is not present but it is required'
  }),
  description: Joi.alternatives().conditional('value', { 
    is: Joi.number().less(0), 
    then: Joi.string().required().messages({
      'string.base': 'description should be a type of string',
      'any.required': 'The field description is not present but it is required when value is less than 0'
    }), 
    otherwise: Joi.string().allow('').messages({
      'string.base': 'description should be a type of string'
    }) 
  })
}).required().messages({
  'object.base': 'The input should be an object',
  'any.required': 'The input is not present but it is required'
})
