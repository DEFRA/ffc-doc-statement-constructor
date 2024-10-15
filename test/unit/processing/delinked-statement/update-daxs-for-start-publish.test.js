const updateD365ForStartPublish = require('../../../../app/processing/delinked-statement/update-d365-for-start-publish')

jest.mock('../../../../app/processing/delinked-statement/update-d365-start-publish-by-d365-id')
const updateD365StartPublishByD365Id = require('../../../../app/processing/delinked-statement/update-d365-start-publish-by-d365-id')

describe('updateD365ForStartPublish', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call updateD365StartPublishByD365Id for each dax', async () => {
    const d365 = [
      { d365Id: 1, paymentReference: 'payment1' },
      { d365Id: 2, paymentReference: 'payment2' },
      { d365Id: 3, paymentReference: 'payment3' }
    ]
    const transaction = {}

    await updateD365ForStartPublish(d365, transaction)

    expect(updateD365StartPublishByD365Id).toHaveBeenCalledTimes(3)
    expect(updateD365StartPublishByD365Id).toHaveBeenCalledWith(1, expect.any(Date), transaction)
    expect(updateD365StartPublishByD365Id).toHaveBeenCalledWith(2, expect.any(Date), transaction)
    expect(updateD365StartPublishByD365Id).toHaveBeenCalledWith(3, expect.any(Date), transaction)
  })
})
