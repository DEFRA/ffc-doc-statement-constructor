const hasValue = require('../../../app/inbound/submit/has-value')

describe('has value', () => {
  test('should return true when value is greater than 0', () => {
    expect(hasValue(1)).toBeTruthy()
  })

  test('should return true when value is less than 0', () => {
    expect(hasValue(-1)).toBeTruthy()
  })

  test('should return false when value is 0', () => {
    expect(hasValue(0)).toBeFalsy()
  })
})
