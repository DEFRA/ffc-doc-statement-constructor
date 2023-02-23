const getPaymentValue = require('../../../../app/processing/settlement/get-payment-value')

describe('get-payment-value', () => {
  test('should return the payment value as settlement value when no last settlement value', () => {
    const result = getPaymentValue(100)
    expect(result).toBe(100)
  })

  test('should return the payment value as settlement value when last settlement undefined', () => {
    const result = getPaymentValue(100, undefined)
    expect(result).toBe(100)
  })

  test('should return the payment value as settlement value when last settlement null', () => {
    const result = getPaymentValue(100, null)
    expect(result).toBe(100)
  })

  test('should return the payment value as settlement value when last settlement 0', () => {
    const result = getPaymentValue(100, 0)
    expect(result).toBe(100)
  })

  test('should return the payment value as when previous settled value exists', () => {
    const result = getPaymentValue(100, 25)
    expect(result).toBe(75)
  })

  test('should return the payment value as settlement value when values are negative', () => {
    const result = getPaymentValue(-100, -25)
    expect(result).toBe(-75)
  })
})
