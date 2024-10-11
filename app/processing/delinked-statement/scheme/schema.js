const { Joi, stringSchema } = require('../../../utility/common-schema-fields')

const codeChars = 50
const codeNameChars = 450

module.exports = Joi.object({
  code: stringSchema('code', codeChars),
  name: stringSchema('name', codeNameChars)
}).required().messages({
  'object.base': 'The input should be an object',
  'any.required': 'The input is not present but it is required'
})
