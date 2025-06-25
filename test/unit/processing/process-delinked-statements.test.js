jest.mock('../../../app/processing/delinked-statement')
const {
  getVerifiedD365DelinkedStatements,
  sendDelinkedStatement,
  updateD365CompletePublishByD365Id,
  resetD365UnCompletePublishByD365Id,
  getDelinkedStatementByPaymentReference,
  checkIfExcluded
} = require('../../../app/processing/delinked-statement')

const processDelinkedStatements = require('../../../app/processing/process-delinked-payment-statements')

let retrievedD365

describe('process statements', () => {
  beforeEach(async () => {
    const d365 = JSON.parse(JSON.stringify(require('../../mock-objects/mock-d365')))
    retrievedD365 = [{ ...d365 }, { ...d365, paymentReference: 'P54542352' }, { ...d365, paymentReference: 'P545882352' }]

    getVerifiedD365DelinkedStatements.mockResolvedValue(retrievedD365)
    updateD365CompletePublishByD365Id.mockResolvedValue(undefined)
    resetD365UnCompletePublishByD365Id.mockResolvedValue(undefined)
    getDelinkedStatementByPaymentReference.mockResolvedValue(undefined)
    sendDelinkedStatement.mockResolvedValue(undefined)
    checkIfExcluded.mockResolvedValue(false)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getVerifiedD365DelinkedStatements', async () => {
    await processDelinkedStatements()
    expect(getVerifiedD365DelinkedStatements).toHaveBeenCalled()
  })

  test('should call checkIfExcluded for each item', async () => {
    await processDelinkedStatements()
    expect(checkIfExcluded).toHaveBeenCalledTimes(retrievedD365.length)
  })

  test('should call getDelinkedStatementByPaymentReference and sendDelinkedStatement when not excluded', async () => {
    checkIfExcluded.mockResolvedValue(false)
    await processDelinkedStatements()
    expect(getDelinkedStatementByPaymentReference).toHaveBeenCalled()
    expect(sendDelinkedStatement).toHaveBeenCalled()
  })

  test('should not call getDelinkedStatementByPaymentReference or sendDelinkedStatement when excluded', async () => {
    checkIfExcluded.mockResolvedValue(true)
    await processDelinkedStatements()
    expect(getDelinkedStatementByPaymentReference).not.toHaveBeenCalled()
    expect(sendDelinkedStatement).not.toHaveBeenCalled()
    expect(updateD365CompletePublishByD365Id).toHaveBeenCalledTimes(retrievedD365.length)
  })

  test('should call updateD365CompletePublishByD365Id for all items', async () => {
    await processDelinkedStatements()
    expect(updateD365CompletePublishByD365Id).toHaveBeenCalledTimes(retrievedD365.length)
  })

  test('should call resetD365UnCompletePublishByD365Id when sendDelinkedStatement fails', async () => {
    checkIfExcluded.mockResolvedValue(false)
    sendDelinkedStatement.mockRejectedValue(new Error('Failed to send delinked statement'))
    await processDelinkedStatements()
    expect(resetD365UnCompletePublishByD365Id).toHaveBeenCalled()
  })

  test('should handle error in getDelinkedStatementByPaymentReference', async () => {
    checkIfExcluded.mockResolvedValue(false)
    getDelinkedStatementByPaymentReference.mockRejectedValue(new Error('Failed to get delinked statement'))
    await processDelinkedStatements()
    expect(getDelinkedStatementByPaymentReference).toHaveBeenCalled()
    expect(sendDelinkedStatement).not.toHaveBeenCalled()
    expect(updateD365CompletePublishByD365Id).not.toHaveBeenCalled()
    expect(resetD365UnCompletePublishByD365Id).toHaveBeenCalled()
  })

  test('should handle error in sendDelinkedStatement', async () => {
    checkIfExcluded.mockResolvedValue(false)
    sendDelinkedStatement.mockRejectedValue(new Error('Failed to send delinked statement'))
    await processDelinkedStatements()
    expect(getDelinkedStatementByPaymentReference).toHaveBeenCalled()
    expect(sendDelinkedStatement).toHaveBeenCalled()
    expect(updateD365CompletePublishByD365Id).not.toHaveBeenCalled()
    expect(resetD365UnCompletePublishByD365Id).toHaveBeenCalled()
  })

  test('should handle error in updateD365CompletePublishByD365Id', async () => {
    checkIfExcluded.mockResolvedValue(false)
    updateD365CompletePublishByD365Id.mockRejectedValue(new Error('Failed to update D365 complete publish'))
    await processDelinkedStatements()
    expect(getDelinkedStatementByPaymentReference).toHaveBeenCalled()
    expect(sendDelinkedStatement).toHaveBeenCalled()
    expect(updateD365CompletePublishByD365Id).toHaveBeenCalled()
    expect(resetD365UnCompletePublishByD365Id).toHaveBeenCalled()
  })

  test('should handle error in resetD365UnCompletePublishByD365Id', async () => {
    checkIfExcluded.mockResolvedValue(false)
    updateD365CompletePublishByD365Id.mockRejectedValue(new Error('Failed to update D365 complete publish'))
    resetD365UnCompletePublishByD365Id.mockRejectedValue(new Error('Failed to reset D365 uncomplete publish'))
    await processDelinkedStatements()
    expect(getDelinkedStatementByPaymentReference).toHaveBeenCalled()
    expect(sendDelinkedStatement).toHaveBeenCalled()
    expect(updateD365CompletePublishByD365Id).toHaveBeenCalled()
    expect(resetD365UnCompletePublishByD365Id).toHaveBeenCalled()
  })
})
