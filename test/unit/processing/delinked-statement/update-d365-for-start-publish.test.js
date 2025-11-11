jest.mock('../../../../app/processing/delinked-statement/update-d365-start-publish-by-d365-id')
const updateD365StartPublishByD365Id = require('../../../../app/processing/delinked-statement/update-d365-start-publish-by-d365-id')
jest.mock('ffc-alerting-utils', () => ({
  dataProcessingAlert: jest.fn()
}))
const { dataProcessingAlert } = require('ffc-alerting-utils')
const updateD365ForStartPublish = require('../../../../app/processing/delinked-statement/update-d365-for-start-publish')

describe('updateD365ForStartPublish', () => {
  const transaction = { id: 'tx' }
  let consoleErrorSpy

  const d365 = [
    { d365Id: 'id1', paymentReference: 'P1' },
    { d365Id: 'id2', paymentReference: 'P2' }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    updateD365StartPublishByD365Id.mockResolvedValue()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    consoleErrorSpy.mockRestore()
  })

  test('should call updateD365StartPublishByD365Id for each item with a Date and the provided transaction', async () => {
    await updateD365ForStartPublish(d365, transaction)

    expect(updateD365StartPublishByD365Id).toHaveBeenCalledTimes(2)
    expect(updateD365StartPublishByD365Id).toHaveBeenCalledWith('id1', expect.any(Date), transaction)
    expect(updateD365StartPublishByD365Id).toHaveBeenCalledWith('id2', expect.any(Date), transaction)
    expect(dataProcessingAlert).not.toHaveBeenCalled()
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  test.each([
    {
      name: 'should call dataProcessingAlert when update fails',
      alertFails: false
    },
    {
      name: 'should log error if dataProcessingAlert fails',
      alertFails: true
    }
  ])('$name', async ({ alertFails }) => {
    const updateError = new Error('update failed')
    const alertError = new Error('alert failed')

    updateD365StartPublishByD365Id.mockResolvedValueOnce() // first succeeds
    updateD365StartPublishByD365Id.mockRejectedValueOnce(updateError) // second fails

    if (alertFails) {
      dataProcessingAlert.mockRejectedValueOnce(alertError)
    } else {
      dataProcessingAlert.mockResolvedValueOnce()
    }

    await expect(updateD365ForStartPublish(d365, transaction)).rejects.toThrowError(
      `Could not start delinked statement for d365 payment: ${d365[1].paymentReference}`
    )

    expect(dataProcessingAlert).toHaveBeenCalledTimes(1)
    const alertArg = dataProcessingAlert.mock.calls[0][0]
    expect(alertArg).toMatchObject({
      process: 'updateD365ForStartPublish',
      paymentReference: d365[1].paymentReference,
      error: updateError,
      message: `Could not start delinked statement for d365 payment: ${d365[1].paymentReference}`
    })

    if (alertFails) {
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `Could not start delinked statement for d365 payment: ${d365[1].paymentReference}`,
        { originalError: updateError, alertError }
      )
    } else {
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    }
  })
})
