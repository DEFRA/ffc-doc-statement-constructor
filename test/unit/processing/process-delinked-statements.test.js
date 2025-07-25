jest.mock('../../../app/processing/delinked-statement')
jest.mock('../../../app/utility/get-excluded-payment-reference-by-payment-reference') // Mocking the utility function

const {
  getVerifiedD365DelinkedStatements,
  sendDelinkedStatement,
  updateD365CompletePublishByD365Id,
  resetD365UnCompletePublishByD365Id,
  getDelinkedStatementByPaymentReference
} = require('../../../app/processing/delinked-statement')

const getExcludedPaymentReferenceByPaymentReference = require('../../../app/utility/get-excluded-payment-reference-by-payment-reference')

const processDelinkedStatements = require('../../../app/processing/process-delinked-payment-statements')

let retrievedD365

describe('process statements', () => {
  beforeEach(async () => {
    const d365 = JSON.parse(JSON.stringify(require('../../mock-objects/mock-d365')))
    retrievedD365 = [{ ...d365 }, { ...d365, paymentReference: 'P54542352' }, { ...d365, paymentReference: 'P545882352' }]

    getVerifiedD365DelinkedStatements.mockResolvedValue(retrievedD365)
    updateD365CompletePublishByD365Id.mockReturnValue(undefined)
    resetD365UnCompletePublishByD365Id.mockResolvedValue(undefined)
    getDelinkedStatementByPaymentReference.mockResolvedValue(undefined)
    sendDelinkedStatement.mockResolvedValue(undefined)
    getExcludedPaymentReferenceByPaymentReference.mockResolvedValue(false)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getVerifiedD365DelinkedStatements', async () => {
    await processDelinkedStatements()
    expect(getVerifiedD365DelinkedStatements).toHaveBeenCalled()
  })

  test('should call getExcludedPaymentReferenceByPaymentReference for each payment reference', async () => {
    await processDelinkedStatements()
    expect(getExcludedPaymentReferenceByPaymentReference).toHaveBeenCalledTimes(retrievedD365.length)
  })

  test('should call getDelinkedStatementByPaymentReference', async () => {
    await processDelinkedStatements()
    expect(getDelinkedStatementByPaymentReference).toHaveBeenCalled()
  })

  test('should call sendDelinkedStatement', async () => {
    await processDelinkedStatements()
    expect(sendDelinkedStatement).toHaveBeenCalled()
  })

  test('should call updateD365CompletePublishByD365Id', async () => {
    await processDelinkedStatements()
    expect(updateD365CompletePublishByD365Id).toHaveBeenCalled()
  })

  test('should call resetD365UnCompletePublishByD365Id when sendDelinkedStatement fails', async () => {
    sendDelinkedStatement.mockRejectedValue(new Error('Failed to send delinked statement'))

    await processDelinkedStatements()
    expect(resetD365UnCompletePublishByD365Id).toHaveBeenCalled()
  })

  test('should handle error in getDelinkedStatementByPaymentReference', async () => {
    getDelinkedStatementByPaymentReference.mockRejectedValue(new Error('Failed to get delinked statement'))

    await processDelinkedStatements()

    expect(getDelinkedStatementByPaymentReference).toHaveBeenCalled()
    expect(sendDelinkedStatement).not.toHaveBeenCalled()
    expect(updateD365CompletePublishByD365Id).not.toHaveBeenCalled()
    expect(resetD365UnCompletePublishByD365Id).toHaveBeenCalled()
  })

  test('should handle error in sendDelinkedStatement', async () => {
    sendDelinkedStatement.mockRejectedValue(new Error('Failed to send delinked statement'))

    await processDelinkedStatements()

    expect(getDelinkedStatementByPaymentReference).toHaveBeenCalled()
    expect(sendDelinkedStatement).toHaveBeenCalled()
    expect(updateD365CompletePublishByD365Id).not.toHaveBeenCalled()
    expect(resetD365UnCompletePublishByD365Id).toHaveBeenCalled()
  })

  test('should handle error in updateD365CompletePublishByD365Id', async () => {
    updateD365CompletePublishByD365Id.mockRejectedValue(new Error('Failed to update D365 complete publish'))

    await processDelinkedStatements()

    expect(getDelinkedStatementByPaymentReference).toHaveBeenCalled()
    expect(sendDelinkedStatement).toHaveBeenCalled()
    expect(updateD365CompletePublishByD365Id).toHaveBeenCalled()
    expect(resetD365UnCompletePublishByD365Id).toHaveBeenCalled()
  })

  test('should handle error in resetD365UnCompletePublishByD365Id', async () => {
    updateD365CompletePublishByD365Id.mockRejectedValue(new Error('Failed to update D365 complete publish'))
    resetD365UnCompletePublishByD365Id.mockRejectedValue(new Error('Failed to reset D365 uncomplete publish'))

    await processDelinkedStatements()

    expect(getDelinkedStatementByPaymentReference).toHaveBeenCalled()
    expect(sendDelinkedStatement).toHaveBeenCalled()
    expect(updateD365CompletePublishByD365Id).toHaveBeenCalled()
    expect(resetD365UnCompletePublishByD365Id).toHaveBeenCalled()
  })

  test('should log when payment reference is excluded', async () => {
    getExcludedPaymentReferenceByPaymentReference.mockResolvedValue(true)
    console.log = jest.fn()

    await processDelinkedStatements()

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Payment reference P54542352 is excluded from Delinked statement processing'))
  })
})
