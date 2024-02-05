const getSettledValue = require('../../../../app/processing/payment/calculate-scheduled-payments/get-settled-value')
const previousSettlements = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-settlements')))

describe('get settled value', () => {
  test('returns maximum value', () => {
    const result = getSettledValue(previousSettlements)
    expect(result).toBe(100000)
  })

  test('does not returns just first value but maximum', () => {
    const result = getSettledValue(previousSettlements)
    expect(result).not.toBe(20000)
  })

  test('does not return just last value but maximum', () => {
    const result = getSettledValue(previousSettlements)
    expect(result).not.toBe(90000)
  })

  test('does not return just any value but maximum', () => {
    const result = getSettledValue(previousSettlements)
    expect(result).not.toBe(80000)
  })

  test('returns zero (0) if no previous settlement', () => {
    const result = getSettledValue([])
    expect(result).toBe(0)
  })
})
