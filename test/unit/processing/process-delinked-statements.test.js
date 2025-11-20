jest.mock('../../../app/processing/delinked-statement', () => ({
  getVerifiedD365DelinkedStatements: jest.fn(),
  sendDelinkedStatement: jest.fn(),
  updateD365CompletePublishByD365Id: jest.fn(),
  resetD365UnCompletePublishByD365Id: jest.fn(),
  getDelinkedStatementByPaymentReference: jest.fn(),
  validateDelinkedStatement: jest.fn()
}))

jest.mock('../../../app/utility/get-excluded-payment-reference-by-payment-reference')

const {
  getVerifiedD365DelinkedStatements,
  sendDelinkedStatement,
  updateD365CompletePublishByD365Id,
  resetD365UnCompletePublishByD365Id,
  getDelinkedStatementByPaymentReference,
  validateDelinkedStatement
} = require('../../../app/processing/delinked-statement')

const getExcludedPaymentReferenceByPaymentReference = require('../../../app/utility/get-excluded-payment-reference-by-payment-reference')

const processDelinkedStatements = require('../../../app/processing/process-delinked-payment-statements')
const { VALIDATION } = require('../../../app/constants/validation')

let retrievedD365

const mocks = {
  getExcludedPaymentReferenceByPaymentReference,
  getDelinkedStatementByPaymentReference,
  validateDelinkedStatement,
  sendDelinkedStatement,
  updateD365CompletePublishByD365Id,
  resetD365UnCompletePublishByD365Id
}

describe('process-delinked-payment-statements', () => {
  beforeEach(async () => {
    const d365 = structuredClone(require('../../mock-objects/mock-d365'))
    retrievedD365 = [
      { ...d365, paymentReference: 'P54542352' },
      { ...d365, paymentReference: 'P545882352' }
    ]

    getVerifiedD365DelinkedStatements.mockResolvedValue(retrievedD365)
    updateD365CompletePublishByD365Id.mockResolvedValue(undefined)
    resetD365UnCompletePublishByD365Id.mockResolvedValue(undefined)
    getDelinkedStatementByPaymentReference.mockResolvedValue({})
    sendDelinkedStatement.mockResolvedValue(undefined)
    getExcludedPaymentReferenceByPaymentReference.mockResolvedValue(false)
    validateDelinkedStatement.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  // --- Basic flow tests ---
  test('should call getVerifiedD365DelinkedStatements', async () => {
    await processDelinkedStatements()
    expect(getVerifiedD365DelinkedStatements).toHaveBeenCalledTimes(1)
  })

  test.each([
    ['getExcludedPaymentReferenceByPaymentReference'],
    ['getDelinkedStatementByPaymentReference'],
    ['validateDelinkedStatement'],
    ['sendDelinkedStatement'],
    ['updateD365CompletePublishByD365Id']
  ])('should call %s once per D365 record', async (mockName) => {
    await processDelinkedStatements()
    expect(mocks[mockName]).toHaveBeenCalledTimes(retrievedD365.length)
  })

  // --- Error handling tests ---
  test.each([
    ['sendDelinkedStatement', new Error('Failed to send delinked statement')],
    ['getDelinkedStatementByPaymentReference', new Error('Failed to get delinked statement')],
    ['updateD365CompletePublishByD365Id', new Error('Failed to update D365 complete publish')]
  ])('should handle error in %s gracefully', async (mockName, mockError) => {
    mocks[mockName].mockRejectedValue(mockError)
    await processDelinkedStatements()
    expect(mocks[mockName]).toHaveBeenCalled()
    await new Promise(resolve => setImmediate(resolve))
    expect(resetD365UnCompletePublishByD365Id).toHaveBeenCalled()
  })

  test('should log when payment reference is excluded', async () => {
    getExcludedPaymentReferenceByPaymentReference.mockResolvedValue(true)
    console.log = jest.fn()
    await processDelinkedStatements()
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Payment reference P54542352 is excluded from Delinked statement processing')
    )
  })

  test('should handle error in validateDelinkedStatement', async () => {
    validateDelinkedStatement.mockRejectedValue(new Error('Validation failed'))
    await processDelinkedStatements()
    expect(validateDelinkedStatement).toHaveBeenCalled()
    expect(sendDelinkedStatement).not.toHaveBeenCalled()
    expect(updateD365CompletePublishByD365Id).not.toHaveBeenCalled()
    await new Promise(resolve => setImmediate(resolve))
    expect(resetD365UnCompletePublishByD365Id).toHaveBeenCalled()
  })

  test('should call updateD365CompletePublishByD365Id when error category is VALIDATION', async () => {
    const validationError = new Error('Validation error')
    validationError.category = VALIDATION
    validateDelinkedStatement.mockRejectedValue(validationError)
    await processDelinkedStatements()
    expect(updateD365CompletePublishByD365Id).toHaveBeenCalled()
  })

  test('should log error when resetting D365 uncomplete publish fails', async () => {
    const processingError = new Error('Processing error')
    sendDelinkedStatement.mockRejectedValue(processingError)
    resetD365UnCompletePublishByD365Id.mockRejectedValue(new Error('Failed to reset D365 uncomplete publish'))
    console.error = jest.fn()
    await processDelinkedStatements()
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Error resetting incomplete publish for D365 ID')
    )
  })
})
