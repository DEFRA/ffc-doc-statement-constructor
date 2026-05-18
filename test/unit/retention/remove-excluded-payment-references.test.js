const db = require('../../../app/data')
const { removeExcludedPaymentReferences } = require('../../../app/retention/remove-excluded-payment-references')

jest.mock('../../../app/data', () => ({
  excludedPaymentReference: {
    destroy: jest.fn()
  },
  Sequelize: {
    Op: {
      in: 'in'
    }
  }
}))

describe('removeExcludedPaymentReferences', () => {
  const paymentReferences = ['PY1234', 'PY5678', 'PY9012']
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.excludedPaymentReference.destroy with correct parameters using Sequelize.Op.in', async () => {
    db.excludedPaymentReference.destroy.mockResolvedValue()

    await removeExcludedPaymentReferences(paymentReferences, transaction)

    expect(db.excludedPaymentReference.destroy).toHaveBeenCalledTimes(1)
    expect(db.excludedPaymentReference.destroy).toHaveBeenCalledWith({
      where: {
        paymentReference: {
          [db.Sequelize.Op.in]: paymentReferences
        }
      },
      transaction
    })
  })

  test('propagates error when db.excludedPaymentReference.destroy rejects', async () => {
    const error = new Error('DB destroy error')
    db.excludedPaymentReference.destroy.mockRejectedValue(error)

    await expect(removeExcludedPaymentReferences(paymentReferences, transaction)).rejects.toThrow('DB destroy error')
  })
})
