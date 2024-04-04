
const updateDaxsForStartPublish = require('../../../../app/processing/sfi-23-quarterly-statement/update-daxs-for-start-publish')

jest.mock('../../../../app/processing/sfi-23-quarterly-statement/update-dax-start-publish-by-dax-id')
const updateDaxStartPublishByDaxId = require('../../../../app/processing/sfi-23-quarterly-statement/update-dax-start-publish-by-dax-id')

describe('updateDaxsForStartPublish', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call updateDaxStartPublishByDaxId for each dax', async () => {
    const daxs = [
      { daxId: 1, paymentReference: 'payment1' },
      { daxId: 2, paymentReference: 'payment2' },
      { daxId: 3, paymentReference: 'payment3' }
    ]
    const transaction = {}

    await updateDaxsForStartPublish(daxs, transaction)

    expect(updateDaxStartPublishByDaxId).toHaveBeenCalledTimes(3)
    expect(updateDaxStartPublishByDaxId).toHaveBeenCalledWith(1, expect.any(Date), transaction)
    expect(updateDaxStartPublishByDaxId).toHaveBeenCalledWith(2, expect.any(Date), transaction)
    expect(updateDaxStartPublishByDaxId).toHaveBeenCalledWith(3, expect.any(Date), transaction)
  })
})
