const db = require('../../../app/data')
const { removeDocuments } = require('../../../app/retention/remove-documents')

jest.mock('../../../app/data', () => ({
  document: {
    destroy: jest.fn()
  },
  Sequelize: {
    Op: {
      in: 'in'
    }
  }
}))

describe('removeDocuments', () => {
  const paymentReferences = ['PY1234', 'PY5678', 'PY9012']
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.document.destroy with correct parameters using Sequelize.Op.in', async () => {
    db.document.destroy.mockResolvedValue()

    await removeDocuments(paymentReferences, transaction)

    expect(db.document.destroy).toHaveBeenCalledTimes(1)
    expect(db.document.destroy).toHaveBeenCalledWith({
      where: {
        documentSourceReference: {
          [db.Sequelize.Op.in]: paymentReferences
        }
      },
      transaction
    })
  })

  test('propagates error when db.document.destroy rejects', async () => {
    const error = new Error('DB destroy error')
    db.document.destroy.mockRejectedValue(error)

    await expect(removeDocuments(paymentReferences, transaction)).rejects.toThrow('DB destroy error')
  })
})
