const validateTotal = require('../../../app/inbound/total/validate-total')
const mockTotal = require('../../mock-objects/mock-total')
const mockInvalidTotal = require('../../mock-objects/mock-invalid-total')

describe('validateTotal', () => {
  test('should validate a valid total', () => {
    const calculationId = '12345678901'
    const result = validateTotal(mockTotal, calculationId)
    expect(result).toEqual(mockTotal)
  })

  test('should throw an error for an invalid total', () => {
    const calculationId = '12345678901'
    expect(() => validateTotal(mockInvalidTotal, calculationId)).toThrow(`Payment request with calculationId: ${calculationId} does not have the required TOTAL data`)
  })
})
