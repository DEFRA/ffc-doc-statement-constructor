const db = require('../../../app/data')
const saveDelinked = require('../../../app/inbound/delinked/save-delinked')

jest.mock('../../../app/data')

describe('saveDelinked', () => {
  const transaction = {}
  const delinkedCalculation = {
    calculationReference: 'calculationReference1',
    applicationReference: 'applicationReference1'
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should save the transformed delinked calculation successfully', async () => {
    db.delinkedCalculation.create.mockResolvedValue()

    await saveDelinked(delinkedCalculation, transaction)

    expect(db.delinkedCalculation.create).toHaveBeenCalledWith({
      calculationId: 'calculationReference1',
      applicationId: 'applicationReference1'
    }, { transaction })
  })

  test('should throw an error if saving fails', async () => {
    const errorMessage = 'Database error'
    db.delinkedCalculation.create.mockRejectedValue(new Error(errorMessage))

    await expect(saveDelinked(delinkedCalculation, transaction)).rejects.toThrow(`Error saving total with Calculation Id calculationReference1: ${errorMessage}`)
  })
})
