const schema = require('../../../../app/inbound/delinked/schema')
const { constants } = require('../../../../app/utility/common-schema-fields')

describe('delinked-schema', () => {
  const validData = {
    applicationReference: 123456,
    applicationId: 123456,
    calculationReference: 123456,
    calculationId: 123456,
    sbi: constants.minSbi,
    frn: constants.minFrn,
    paymentBand1: 'validString',
    paymentBand2: 'validString',
    paymentBand3: 'validString',
    paymentBand4: 'validString',
    percentageReduction1: 'validString',
    percentageReduction2: 'validString',
    percentageReduction3: 'validString',
    percentageReduction4: 'validString',
    progressiveReductions1: 'validString',
    progressiveReductions2: 'validString',
    progressiveReductions3: 'validString',
    progressiveReductions4: 'validString',
    referenceAmount: 'validString',
    totalProgressiveReduction: 'validString',
    totalDelinkedPayment: 'validString',
    paymentAmountCalculated: 'validString',
    datePublished: new Date(),
    type: constants.DELINKED
  }

  test('should validate a valid object', () => {
    const { error } = schema.validate(validData)
    expect(error).toBeUndefined()
  })

  test('should invalidate an object with missing required fields', () => {
    const { error } = schema.validate({})
    expect(error).toBeDefined()
  })

  test('should invalidate an object with incorrect types', () => {
    const invalidData = {
      ...validData,
      applicationReference: 'notANumber',
      sbi: 'notANumber',
      frn: 'notANumber',
      datePublished: 'notADate',
      type: 'invalidType'
    }
    const { error } = schema.validate(invalidData)
    expect(error).toBeDefined()
  })

  test('should invalidate an object with out of range numbers', () => {
    const invalidData = {
      ...validData,
      sbi: constants.minSbi - 1,
      frn: constants.maxFrn + 1
    }
    const { error } = schema.validate(invalidData)
    expect(error).toBeDefined()
  })

  test('should invalidate an object with missing required string fields', () => {
    const invalidData = {
      ...validData,
      paymentBand1: undefined,
      percentageReduction1: undefined,
      progressiveReductions1: undefined,
      referenceAmount: undefined,
      totalProgressiveReduction: undefined,
      totalDelinkedPayment: undefined,
      paymentAmountCalculated: undefined
    }
    const { error } = schema.validate(invalidData)
    expect(error).toBeDefined()
  })

  test('should allow null for datePublished', () => {
    const validDataWithNullDate = {
      ...validData,
      datePublished: null
    }
    const { error } = schema.validate(validDataWithNullDate)
    expect(error).toBeUndefined()
  })

  test('should invalidate an object with non-integer applicationReference', () => {
    const invalidData = {
      ...validData,
      applicationReference: 123.45
    }
    const { error } = schema.validate(invalidData)
    expect(error).toBeDefined()
  })
})
