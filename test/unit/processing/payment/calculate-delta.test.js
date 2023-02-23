const calculateDelta = require('../../../../app/processing/payment/calculate-delta')

let previousValue
let newValue

describe('calculate delta', () => {
  beforeEach(() => {
    previousValue = 100
    newValue = 200
  })

  test('should return the difference between two values when value increases', () => {
    const actual = calculateDelta(previousValue, newValue)
    expect(actual).toEqual(100)
  })

  test('should return the difference between two values when value decreases', () => {
    newValue = 50
    const actual = calculateDelta(previousValue, newValue)
    expect(actual).toEqual(-50)
  })

  test('should return the difference between two values when value is the same', () => {
    newValue = 100
    const actual = calculateDelta(previousValue, newValue)
    expect(actual).toEqual(0)
  })
})
