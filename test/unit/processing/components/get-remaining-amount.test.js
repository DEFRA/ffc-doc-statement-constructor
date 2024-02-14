const { convertToPounds } = require('../../../../app/utility')

const getRemainingAmount = require('../../../../app/processing/components/get-remaining-amount')

const scheduleDates = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-timelines')))

let currentClaimValue
let paidAmount
let originalRemainingClaimValue

let paymentSchedule
let newValue

describe('get remaining amount', () => {
  beforeEach(() => {
    currentClaimValue = scheduleDates.reduce((runningTotal, record) => runningTotal + record.value, 0)
    paidAmount = scheduleDates.filter(record => !record.outstanding).reduce((runningTotal, record) => runningTotal + record.value, 0)
    originalRemainingClaimValue = currentClaimValue - paidAmount
  })

  describe('top up', () => {
    beforeEach(() => {
      paymentSchedule = scheduleDates
      newValue = currentClaimValue + 25000
    })

    test('should return a number', () => {
      const result = getRemainingAmount(paymentSchedule, newValue)
      expect(result).toEqual(expect.any(Number))
    })

    test('should return a value greater than Number(convertToPounds(originalRemainingClaimValue))', () => {
      const result = getRemainingAmount(paymentSchedule, newValue)
      expect(result).toBeGreaterThan(Number(convertToPounds(originalRemainingClaimValue)))
    })

    test('should return Number(convertToPounds(newValue - paidAmount))', () => {
      const result = getRemainingAmount(paymentSchedule, newValue)
      expect(result).toBe(Number(convertToPounds(newValue - paidAmount)))
    })
  })

  describe('reduction', () => {
    beforeEach(() => {
      paymentSchedule = scheduleDates
      newValue = currentClaimValue - 25000
    })

    test('should return a number', () => {
      const result = getRemainingAmount(paymentSchedule, newValue)
      expect(result).toEqual(expect.any(Number))
    })

    test('should return value less than Number(convertToPounds(originalRemainingClaimValue))', () => {
      const result = getRemainingAmount(paymentSchedule, newValue)
      expect(result).toBeLessThan(Number(convertToPounds(originalRemainingClaimValue)))
    })

    test('should return Number(convertToPounds(newValue - paidAmount))', () => {
      const result = getRemainingAmount(paymentSchedule, newValue)
      expect(result).toBe(Number(convertToPounds(newValue - paidAmount)))
    })
  })

  describe('reduction to zero', () => {
    beforeEach(() => {
      paymentSchedule = scheduleDates
      newValue = paidAmount
    })

    test('should return a number', () => {
      const result = getRemainingAmount(paymentSchedule, newValue)
      expect(result).toEqual(expect.any(Number))
    })

    test('should return 0', () => {
      const result = getRemainingAmount(paymentSchedule, newValue)
      expect(result).toBe(0)
    })
  })

  describe('recovery', () => {
    beforeEach(() => {
      paymentSchedule = scheduleDates
      newValue = originalRemainingClaimValue - (originalRemainingClaimValue + 25000)
    })

    test('should return a number', () => {
      const result = getRemainingAmount(paymentSchedule, newValue)
      expect(result).toEqual(expect.any(Number))
    })

    test('should return a value less than 0', () => {
      const result = getRemainingAmount(paymentSchedule, newValue)
      expect(result).toBeLessThan(0)
    })

    test('should return Number(convertToPounds(newValue - paidAmount))', () => {
      const result = getRemainingAmount(paymentSchedule, newValue)
      expect(result).toBe(Number(convertToPounds(newValue - paidAmount)))
    })
  })
})
