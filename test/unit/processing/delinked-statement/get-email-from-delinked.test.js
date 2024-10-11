const db = require('../../../../app/data')
const getEmailDelinked = require('../../../../app/processing/delinked-statement/get-email-from-delinked')

jest.mock('../../../../app/data')

describe('getEmailDelinked', () => {
  const mockDelinkedCalculation = {
    emailAddress: 'test@example.com',
    calculationId: 1
  }

  const mockTransaction = {}

  beforeEach(() => {
    db.delinkedCalculation.findOne.mockReset()
  })

  test('should return delinked calculation data when found', async () => {
    db.delinkedCalculation.findOne.mockResolvedValue(mockDelinkedCalculation)

    const result = await getEmailDelinked('test@example.com', mockTransaction)

    expect(result).toEqual(mockDelinkedCalculation)
    expect(db.delinkedCalculation.findOne).toHaveBeenCalledWith({
      transaction: mockTransaction,
      lock: true,
      where: { emailAddress: 'test@example.com' }
    })
  })

  test('should return null when no delinked calculation is found', async () => {
    db.delinkedCalculation.findOne.mockResolvedValue(null)

    const result = await getEmailDelinked('test@example.com', mockTransaction)

    expect(result).toBeNull()
    expect(db.delinkedCalculation.findOne).toHaveBeenCalledWith({
      transaction: mockTransaction,
      lock: true,
      where: { emailAddress: 'test@example.com' }
    })
  })
})
