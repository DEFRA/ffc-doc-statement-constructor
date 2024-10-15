const { Joi, numberSchema, stringSchema, constants } = require('../../../utility/common-schema-fields')

module.exports = Joi.object({
  sbi: numberSchema('sbi', constants.minSbi, constants.maxSbi),
  addressLine1: stringSchema('addressLine1').allow('', null).optional(),
  addressLine2: stringSchema('addressLine2').allow('', null).optional(),
  addressLine3: stringSchema('addressLine3').allow('', null).optional(),
  city: stringSchema('city').allow('', null).optional(),
  county: stringSchema('county').allow('', null).optional(),
  emailAddress: stringSchema('emailAddress').allow('', null).optional(),
  frn: numberSchema('frn', constants.minFrn, constants.maxFrn),
  name: stringSchema('name'),
  postcode: stringSchema('postcode').allow('', null).optional()
}).required().messages({
  'object.base': 'The input should be an object',
  'any.required': 'The input is not present but it is required'
})
