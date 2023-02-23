const isFirstPayment = require('../../../app/inbound/return/is-first-payment')
const { SFI_FIRST_PAYMENT, SFI_SECOND_PAYMENT } = require('../../mock-components/mock-invoice-number')

describe('is first payment', () => {
  test('should return true when first payment', () => {
    expect(isFirstPayment(SFI_FIRST_PAYMENT)).toBeTruthy()
  })

  test('should return false when not first payment', () => {
    expect(isFirstPayment(SFI_SECOND_PAYMENT)).toBeFalsy()
  })

  test('should return false when shorter than suffix', () => {
    expect(isFirstPayment('X')).toBeFalsy()
  })

  test('should return false when undefined', () => {
    expect(isFirstPayment()).toBeFalsy()
  })

  test('should return false when null', () => {
    expect(isFirstPayment(null)).toBeFalsy()
  })

  test('should return false when empty string', () => {
    expect(isFirstPayment('')).toBeFalsy()
  })

  test('should return false when not a string', () => {
    expect(isFirstPayment(123)).toBeFalsy()
  })
})
