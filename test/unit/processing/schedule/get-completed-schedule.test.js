const db = require('../../../../app/data')
const getCompletedSchedule = require('../../../../app/processing/schedule/get-completed-schedule')

jest.mock('../../../../app/data', () => ({
  schedule: {
    findOne: jest.fn()
  },
  Sequelize: {
    Op: {
      ne: Symbol('ne')
    }
  }
}))

describe('getCompletedSchedule', () => {
  test('should call db.schedule.findOne with correct arguments', async () => {
    const paymentRequestId = 'mockPaymentRequestId'
    const transaction = 'mockTransaction'

    await getCompletedSchedule(paymentRequestId, transaction)

    expect(db.schedule.findOne).toHaveBeenCalledWith({
      transaction,
      where: {
        paymentRequestId,
        completed: {
          [db.Sequelize.Op.ne]: null
        },
        voided: null
      }
    })
  })
})
