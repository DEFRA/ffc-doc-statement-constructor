const Joi = require('joi')

module.exports = Joi.array().items(
  Joi.object({
    calculationId: Joi.number().messages({
      'number.base': 'calculationId should be a type of number'
    }),
    area: Joi.when(
      'name', {
        is: 'Moorland',
        then: Joi.when(
          'level', {
            is: 'Additional',
            then: Joi.string().allow('').allow(null).default('').messages({
              'string.base': 'area should be a type of string'
            }),
            otherwise: Joi.number().required().messages({
              'number.base': 'area should be a type of number',
              'any.required': 'The field area is not present but it is required'
            })
          }
        ),
        otherwise: Joi.number().required().messages({
          'number.base': 'area should be a type of number',
          'any.required': 'The field area is not present but it is required'
        })
      }
    ),
    fundingCode: Joi.number().required().messages({
      'number.base': 'fundingCode should be a type of number',
      'any.required': 'The field fundingCode is not present but it is required'
    }),
    level: Joi.string().allow('').allow(null).default('').messages({
      'string.base': 'level should be a type of string'
    }),
    name: Joi.string().required().messages({
      'string.base': 'name should be a type of string',
      'any.required': 'The field name is not present but it is required'
    }),
    rate: Joi.when(
      'name', {
        is: 'Moorland',
        then: Joi.when(
          'level', {
            is: 'Additional',
            then: Joi.string().allow('').allow(null).default('').messages({
              'string.base': 'rate should be a type of string'
            }),
            otherwise: Joi.number().required().messages({
              'number.base': 'rate should be a type of number',
              'any.required': 'The field rate is not present but it is required'
            })
          }
        ),
        otherwise: Joi.number().required().messages({
          'number.base': 'rate should be a type of number',
          'any.required': 'The field rate is not present but it is required'
        })
      }
    )
  })
).min(1).required().messages({
  'array.base': 'The input should be an array',
  'array.min': 'The array should have at least one item',
  'any.required': 'The input is not present but it is required'
})
