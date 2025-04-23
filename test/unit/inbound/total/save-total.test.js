const db = require('../../../../app/data')
const saveTotal = require('../../../../app/inbound/total/save-total')

describe('saveTotal function', () => {
  test('should throw an error if saving the total fails', async () => {
    const mockTotal = {
      calculationReference: '123456789',
      claimReference: 'claim123'
    }
    const mockTransaction = 'mockTransaction'
    const errorMessage = 'Error saving total with Calculation Id: db.total.create is not a function'
    const error = new Error(errorMessage)
    db.total.create = jest.fn().mockRejectedValue(error)

    await expect(saveTotal(mockTotal, mockTransaction)).rejects.toThrow(new RegExp(errorMessage))
  })
})
