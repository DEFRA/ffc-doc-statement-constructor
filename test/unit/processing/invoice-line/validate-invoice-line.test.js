const schema = require('../../../../app/processing/invoice-line/schema')
let grossInvoiceLine
let reductionInvoiceLine

describe('invoice line schema', () => {
  beforeEach(() => {
    grossInvoiceLine = {
      value: 50000
    }

    reductionInvoiceLine = {
      description: 'P02 - Over declaration reduction',
      value: -2000
    }
  })

  test('should not error if gross has value and no description', () => {
    const result = schema.validate(grossInvoiceLine)
    expect(result.error).toBeUndefined()
  })

  test('should not error if gross has value and description', () => {
    grossInvoiceLine.description = 'G00 - Gross value of claim'
    const result = schema.validate(grossInvoiceLine)
    expect(result.error).toBeUndefined()
  })

  test('should error if gross has null value', () => {
    grossInvoiceLine.value = null
    const result = schema.validate(grossInvoiceLine)
    expect(result.error).toBeDefined()
  })

  test('should error if gross has undefined value', () => {
    grossInvoiceLine.value = undefined
    const result = schema.validate(grossInvoiceLine)
    expect(result.error).toBeDefined()
  })

  test('should not error if reduction line has value and description', () => {
    const result = schema.validate(reductionInvoiceLine)
    expect(result.error).toBeUndefined()
  })

  test('should error if reduction line has null value', () => {
    reductionInvoiceLine.value = null
    const result = schema.validate(reductionInvoiceLine)
    expect(result.error).toBeDefined()
  })

  test('should error if reduction line has undefined value', () => {
    reductionInvoiceLine.value = undefined
    const result = schema.validate(reductionInvoiceLine)
    expect(result.error).toBeDefined()
  })

  test('should error if reduction line has null description', () => {
    reductionInvoiceLine.description = null
    const result = schema.validate(reductionInvoiceLine)
    expect(result.error).toBeDefined()
  })

  test('should error if reduction line has undefined description', () => {
    reductionInvoiceLine.description = undefined
    const result = schema.validate(reductionInvoiceLine)
    expect(result.error).toBeDefined()
  })
})
