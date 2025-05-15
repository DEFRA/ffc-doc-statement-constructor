const schema = require('../../../../app/inbound/delinked/schema')
const validateDelinked = require('../../../../app/inbound/delinked/validate-delinked')

jest.mock('../../../../app/inbound/delinked/schema')

describe('validateDelinked', () => {
  const calculationId = 'calculationId1'
  const validDelinked = {
    applicationId: 123456,
    calculationId: 123456,
    sbi: 123456789,
    frn: 123456789,
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
    type: 'DELINKED'
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should validate a valid delinked object', () => {
    schema.validate.mockReturnValue({ value: validDelinked })

    const result = validateDelinked(validDelinked, calculationId)

    expect(result).toEqual(validDelinked)
    expect(schema.validate).toHaveBeenCalledWith(validDelinked, { abortEarly: false })
  })

  test('should throw an error for an invalid delinked object', () => {
    const errorMessage = 'Validation error'
    schema.validate.mockReturnValue({ error: new Error(errorMessage) })

    expect(() => validateDelinked({}, calculationId)).toThrow(`Total with calculationId: ${calculationId} does not have the required DELINKED data: ${errorMessage}`)
    expect(schema.validate).toHaveBeenCalledWith({}, { abortEarly: false })
  })

  test('should return the validated value for a valid delinked object', () => {
    schema.validate.mockReturnValue({ value: validDelinked })

    const result = validateDelinked(validDelinked, calculationId)

    expect(result).toEqual(validDelinked)
  })
})
