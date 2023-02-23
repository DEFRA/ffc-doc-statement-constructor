const validateStatement = require('../../../../app/processing/statement/validate-statement')

let statement

describe('validate statement', () => {
  beforeEach(() => {
    statement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-statement')))
  })

  test('should true if valid statement', async () => {
    const result = validateStatement(statement)
    expect(result).toBe(true)
  })

  test('should return false if payment is 0', async () => {
    statement.payments[0].value = 0
    const result = validateStatement(statement)
    expect(result).toBe(false)
  })

  test('should return false if payment is null', async () => {
    statement.payments[0].value = null
    const result = validateStatement(statement)
    expect(result).toBe(false)
  })

  test('should return false if payment is undefined', async () => {
    statement.payments[0].value = undefined
    const result = validateStatement(statement)
    expect(result).toBe(false)
  })

  test('should return false if payment is NaN', async () => {
    statement.payments[0].value = NaN
    const result = validateStatement(statement)
    expect(result).toBe(false)
  })

  test('should return false if payment is less than 0', async () => {
    statement.payments[0].value = -1
    const result = validateStatement(statement)
    expect(result).toBe(false)
  })
})
