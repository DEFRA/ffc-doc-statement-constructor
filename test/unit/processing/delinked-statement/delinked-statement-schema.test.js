const schema = require('../../../../app/processing/delinked-statement/delinked-statement-schema')

describe('validationSchema', () => {
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
    marketingYear: 2024,
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

  test('shouldValidateCorrectData', () => {
    const { error } = schema.validate(validData)
    expect(error).toBeUndefined()
  })

  describe('requiredFields', () => {
    test('shouldFailWhenRequiredFieldsAreMissing', () => {
      const { error } = schema.validate({})
      expect(error).toBeDefined()
      expect(error.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: expect.stringContaining('is not present but it is required')
          })
        ])
      )
    })
  })

  describe('frnAndSbi', () => {
    test.each([
      ['frn', 99999999999, 'frn should have a maximum value of 9999999999'],
      ['sbi', 100000000, 'sbi should have a minimum value of 105000000']
    ])('shouldFailWhen%sIsOutOfRange', (field, value, expectedMessage) => {
      const invalidData = { ...validData, [field]: value }
      const { error } = schema.validate(invalidData)
      expect(error).toBeDefined()
      expect(error.details[0].message).toBe(expectedMessage)
    })
  })

  describe('emailValidation', () => {
    test('shouldFailWithInvalidEmailFormat', () => {
      const invalidData = { ...validData, email: 23 }
      const { error } = schema.validate(invalidData)
      expect(error).toBeDefined()
      expect(error.details[0].message).toBe('email should be a type of string')
    })
  })

  describe('schemeValidation', () => {
    test('shouldFailWhenSchemeNameIsInvalid', () => {
      const invalidData = {
        ...validData,
        scheme: { name: 'Invalid Scheme', shortName: 'DP', year: 2024 }
      }
      const { error } = schema.validate(invalidData)
      expect(error).toBeDefined()
      expect(error.details[0].message).toBe('Scheme name must be Delinked Payment Statement')
    })
  })
})
