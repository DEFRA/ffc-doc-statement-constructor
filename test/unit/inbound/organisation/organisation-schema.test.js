const schema = require('../../../../app/inbound/organisation/schema')
const { CALCULATION } = require('../../../../app/constants/types')

describe('Schema Validation', () => {
  test('should validate a correct object', () => {
    const obj = {
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
      type: CALCULATION,
      updated: new Date()
    }
    const { error } = schema.validate(obj)
    expect(error).toBeUndefined()
  })

  test('should fail validation for an incorrect object', () => {
    const obj = {
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
    const { error } = schema.validate(obj)
    expect(error).toBeDefined()
  })
})
