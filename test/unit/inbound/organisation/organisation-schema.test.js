const schema = require('../../../../app/inbound/organisation/schema')
const { ORGANISATION } = require('../../../../app/constants/types')

describe('Organisation schema validation', () => {
  const validOrganisation = {
    sbi: 105000001,
    addressLine1: 'Address 1',
    addressLine2: 'Address 2',
    addressLine3: 'Address 3',
    city: 'City',
    county: 'County',
    emailAddress: 'test@example.com',
    frn: 1000000001,
    name: 'Name',
    postcode: 'AB1 2CD',
    type: ORGANISATION,
    updated: new Date()
  }

  test('valid organisation should pass validation', () => {
    const { error } = schema.validate(validOrganisation)
    expect(error).toBeUndefined()
  })

  test('invalid organisation should fail validation', () => {
    const invalidOrganisation = {
      sbi: 'invalid',
      addressLine1: 123,
      addressLine2: 123,
      addressLine3: 123,
      city: 123,
      county: 123,
      emailAddress: 'invalid',
      frn: 'invalid',
      name: 123,
      postcode: 'invalid',
      type: 'invalid',
      updated: 'invalid'
    }

    const { error } = schema.validate(invalidOrganisation)
    expect(error).toBeDefined()
  })
})
