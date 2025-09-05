const { DELINKED } = require('../../../../app/constants/types')
const schema = require('../../../../app/inbound/delinked/schema')
const { constants } = require('../../../../app/utility/common-schema-fields')

describe('delinked-schema', () => {
  const validData = {
    applicationId: 123456,
    calculationId: 123456,
    sbi: constants.minSbi,
    frn: constants.minFrn,
    paymentBand1: 'validString',
    paymentBand2: 'validString',
    paymentBand3: 'validString',
    paymentBand4: 'validString',
    percentageReduction1: '50.00',
    percentageReduction2: '60.00',
    percentageReduction3: '75.00',
    percentageReduction4: '100.00',
    progressiveReductions1: '1.25',
    progressiveReductions2: '32.00',
    progressiveReductions3: '250.00',
    progressiveReductions4: '1234563673634.54',
    referenceAmount: '45124.12',
    totalProgressiveReduction: '124.12',
    totalDelinkedPayment: '45000.00',
    paymentAmountCalculated: '22500.00',
    updated: new Date(),
    datePublished: new Date(),
    type: DELINKED
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
      updated: 'notADate',
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

  test('should not allow null for updated', () => {
    const validDataWithNullDate = {
      ...validData,
      updated: null
    }
    const { error } = schema.validate(validDataWithNullDate)
    expect(error).toBeDefined()
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
