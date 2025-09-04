const schema = require('../../../../app/processing/delinked-statement/delinked-statement-schema')

describe('Validation Schema', () => {
  const validData = {
    address: {
      line1: '123 Main St',
      line2: 'Suite 100',
      line3: null,
      line4: null,
      line5: null,
      postcode: '12345678'
    },
    businessName: 'Test Business',
    email: 'test@example.com',
    frn: 1000000000,
    sbi: 105000000,
    paymentReference: 'PY12345678',
    calculationId: 1,
    paymentPeriod: '2024-01',
    paymentAmount: '1000.00',
    transactionDate: '2024-01-01T00:00:00Z',
    applicationId: 1,
    paymentBand1: 'Band 1',
    paymentBand2: 'Band 2',
    paymentBand3: 'Band 3',
    paymentBand4: 'Band 4',
    percentageReduction1: '10.00',
    percentageReduction2: '15.00',
    percentageReduction3: '20.00',
    percentageReduction4: '25.00',
    progressiveReductions1: '100.00',
    progressiveReductions2: '200.00',
    progressiveReductions3: '300.00',
    progressiveReductions4: '400.00',
    referenceAmount: '1000.00',
    totalProgressiveReduction: '100.00',
    totalDelinkedPayment: '900.00',
    paymentAmountCalculated: '950.00',
    scheme: {
      name: 'Delinked Payment Statement',
      shortName: 'DP',
      year: 2024
    },
    previousPaymentCount: 0,
    documentReference: 1,
    excludedFromNotify: true
  }

  test('should validate correct data', () => {
    const { error } = schema.validate(validData)
    expect(error).toBeUndefined()
  })

  test('should fail when required fields are missing', () => {
    const { error } = schema.validate({})

    expect(error).toBeDefined()
    expect(error.details).toEqual(expect.arrayContaining([
      expect.objectContaining({ message: expect.stringContaining('is not present but it is required') })
    ]))
  })

  test('should fail when frn is out of range', () => {
    const invalidData = { ...validData, frn: 99999999999 }
    const { error } = schema.validate(invalidData)

    expect(error).toBeDefined()
    expect(error.details[0].message).toBe('frn should have a maximum value of 9999999999')
  })

  test('should fail when sbi is out of range', () => {
    const invalidData = { ...validData, sbi: 100000000 }
    const { error } = schema.validate(invalidData)

    expect(error).toBeDefined()
    expect(error.details[0].message).toBe('sbi should have a minimum value of 105000000')
  })

  test('should fail with invalid email format', () => {
    const invalidData = { ...validData, email: 23 }
    const { error } = schema.validate(invalidData)

    expect(error).toBeDefined()
    expect(error.details[0].message).toBe('email should be a type of string')
  })

  test('should fail when scheme name is invalid', () => {
    const invalidData = { ...validData, scheme: { name: 'Invalid Scheme', shortName: 'DP', year: 2024 } }
    const { error } = schema.validate(invalidData)

    expect(error).toBeDefined()
    expect(error.details[0].message).toBe('Scheme name must be Delinked Payment Statement')
  })

  test('should fail when scheme short name is invalid', () => {
    const invalidData = { ...validData, scheme: { name: 'Delinked Payment Statement', shortName: 'INVALID', year: 2024 } }
    const { error } = schema.validate(invalidData)

    expect(error).toBeDefined()
    expect(error.details[0].message).toBe('Scheme short name must be DP')
  })

  test('should fail when year is not valid', () => {
    const invalidData = { ...validData, scheme: { name: 'Delinked Payment Statement', shortName: 'DP', year: 2023 } }
    const { error } = schema.validate(invalidData)

    expect(error).toBeDefined()
    expect(error.details[0].message).toBe('Year must be either 2024 or 2025')
  })

  test('should fail when excludedFromNotify is not boolean', () => {
    const invalidData = { ...validData, excludedFromNotify: 'not-a-boolean' }
    const { error } = schema.validate(invalidData)

    expect(error).toBeDefined()
    expect(error.details[0].message).toBe('Excluded from notify must be a boolean')
  })
})
