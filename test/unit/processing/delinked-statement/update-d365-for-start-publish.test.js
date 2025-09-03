jest.mock('../../../../app/processing/delinked-statement/update-d365-start-publish-by-d365-id')
const updateD365StartPublishByD365Id = require('../../../../app/processing/delinked-statement/update-d365-start-publish-by-d365-id')
jest.mock('../../../../app/utility/processing-alerts', () => ({
  dataProcessingAlert: jest.fn()
}))
const { dataProcessingAlert } = require('../../../../app/utility/processing-alerts')
const updateD365ForStartPublish = require('../../../../app/processing/delinked-statement/update-d365-for-start-publish')

describe('updateD365ForStartPublish', () => {
  const transaction = { id: 'tx' }
  let consoleErrorSpy
  beforeEach(() => {
    jest.clearAllMocks()
    updateD365StartPublishByD365Id.mockResolvedValue()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterAll(() => {
    consoleErrorSpy.mockRestore()
  })
  test('should call updateD365StartPublishByD365Id for each item with a Date and the provided transaction', async () => {
    const d365 = [
      { d365Id: 'id1', paymentReference: 'P1' },
      { d365Id: 'id2', paymentReference: 'P2' }
    ]
    await updateD365ForStartPublish(d365, transaction)
    expect(updateD365StartPublishByD365Id).toHaveBeenCalledTimes(2)
    expect(updateD365StartPublishByD365Id).toHaveBeenCalledWith('id1', expect.any(Date), transaction)
    expect(updateD365StartPublishByD365Id).toHaveBeenCalledWith('id2', expect.any(Date), transaction)
    expect(dataProcessingAlert).not.toHaveBeenCalled()
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })
  test('should call dataProcessingAlert and throw when updateD365StartPublishByD365Id throws', async () => {
    const error = new Error('update failed')
    updateD365StartPublishByD365Id.mockResolvedValueOnce()
    updateD365StartPublishByD365Id.mockRejectedValueOnce(error)
    dataProcessingAlert.mockResolvedValueOnce()
    const d365 = [
      { d365Id: 'id1', paymentReference: 'P1' },
      { d365Id: 'id2', paymentReference: 'P2' }
    ]
    await expect(updateD365ForStartPublish(d365, transaction)).rejects.toThrowError(
      `Could not start delinked statement for d365 payment: ${d365[1].paymentReference}`
    )
    expect(dataProcessingAlert).toHaveBeenCalledWith({
      process: 'updateD365ForStartPublish',
      paymentReference: d365[1].paymentReference,
      error,
      message: `Could not start delinked statement for d365 payment: ${d365[1].paymentReference}`
    }, expect.anything())
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })
  test('should log an error if dataProcessingAlert itself throws and still rethrow the original error', async () => {
    const updateError = new Error('update failed')
    const alertError = new Error('alert failed')
    updateD365StartPublishByD365Id.mockResolvedValueOnce()
    updateD365StartPublishByD365Id.mockRejectedValueOnce(updateError)
    dataProcessingAlert.mockRejectedValueOnce(alertError)
    const d365 = [
      { d365Id: 'id1', paymentReference: 'P1' },
      { d365Id: 'id2', paymentReference: 'P2' }
    ]
    await expect(updateD365ForStartPublish(d365, transaction)).rejects.toThrowError(
      `Could not start delinked statement for d365 payment: ${d365[1].paymentReference}`
    )
    expect(dataProcessingAlert).toHaveBeenCalled()
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Could not start delinked statement for d365 payment: ${d365[1].paymentReference}`,
      { originalError: updateError, alertError }
    )
  })
})
