const getAdjustment = require('../../../../app/processing/components/get-adjustment')
const previousValue = 10000
const newValue = 20000
const adjustmentValue = 10000

describe('get adjustment', () => {
  test('should return adjustment as object', () => {
    const adjustment = getAdjustment(previousValue, newValue, adjustmentValue)
    expect(adjustment).toEqual(expect.any(Object))
  })

  test('should return adjustment with current value in pounds', () => {
    const adjustment = getAdjustment(previousValue, newValue, adjustmentValue)
    expect(adjustment.currentValue).toEqual('100.00')
  })

  test('should return adjustment with new value in pounds', () => {
    const adjustment = getAdjustment(previousValue, newValue, adjustmentValue)
    expect(adjustment.newValue).toEqual('200.00')
  })

  test('should return adjustment with adjustment value in pounds', () => {
    const adjustment = getAdjustment(previousValue, newValue, adjustmentValue)
    expect(adjustment.adjustmentValue).toEqual('100.00')
  })
})
