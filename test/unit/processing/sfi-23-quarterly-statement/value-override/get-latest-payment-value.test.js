const getLatestPaymentValue = require('../../../../../app/processing/sfi-23-quarterly-statement/value-override/get-latest-payment-value')

describe('get latest payment value', () => {
  test('should return the correct payment value with supporting settlements', () => {
    const settlement = { value: 10000 }
    const supportingSettlements = [
      { paymentValue: 5000 },
      { paymentValue: 3000 }
    ]

    const result = getLatestPaymentValue(settlement, supportingSettlements)
    expect(result).toBe(180)
  })

  test('should return the correct payment value with negative valued supporting settlements', () => {
    const settlement = { value: 10000 }
    const supportingSettlements = [
      { paymentValue: -5000 },
      { paymentValue: 3000 }
    ]

    const result = getLatestPaymentValue(settlement, supportingSettlements)
    expect(result).toBe(80)
  })

  test('should return the settlement value / 100 if no supporting settlements are provided', () => {
    const settlement = { value: 10000 }
    const supportingSettlements = []

    const result = getLatestPaymentValue(settlement, supportingSettlements)
    expect(result).toBe(100)
  })

  test('should return the settlement value / 100 if supporting settlements are null', () => {
    const settlement = { value: 5000 }
    const supportingSettlements = null

    const result = getLatestPaymentValue(settlement, supportingSettlements)
    expect(result).toBe(50)
  })

  test('should return the settlement value / 100 if supporting settlements are undefined', () => {
    const settlement = { value: 2000 }
    const supportingSettlements = undefined

    const result = getLatestPaymentValue(settlement, supportingSettlements)
    expect(result).toBe(20)
  })

  test('should return the settlement value / 100 if supporting settlements are empty array', () => {
    const settlement = { value: 3000 }
    const supportingSettlements = []

    const result = getLatestPaymentValue(settlement, supportingSettlements)
    expect(result).toBe(30)
  })

  test('should sum up and remove supporting settlements values even if some have zero values', () => {
    const settlement = { value: 10000 }
    const supportingSettlements = [
      { paymentValue: 0 },
      { paymentValue: 5000 }
    ]

    const result = getLatestPaymentValue(settlement, supportingSettlements)
    expect(result).toBe(150)
  })
})
