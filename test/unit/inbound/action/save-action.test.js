jest.mock('../../../../app/data')

const db = require('../../../../app/data')
const saveAction = require('../../../../app/inbound/total/save-actions')

describe('saveAction', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should save actions with transformed references using bulkCreate', async () => {
    const mockTransaction = jest.fn()
    const actions = [
      { actionReference: 'action1', calculationReference: 'calculation1', data: 'data1' },
      { actionReference: 'action2', calculationReference: 'calculation2', data: 'data2' }
    ]

    await saveAction(actions, mockTransaction)

    expect(db.action.bulkCreate).toHaveBeenCalledTimes(1)
    expect(db.action.bulkCreate).toHaveBeenCalledWith(
      [
        {
          actionId: 'action1',
          calculationId: 'calculation1',
          data: 'data1'
        },
        {
          actionId: 'action2',
          calculationId: 'calculation2',
          data: 'data2'
        }
      ],
      { transaction: mockTransaction }
    )
  })

  test('should handle empty action array', async () => {
    const mockTransaction = jest.fn()
    const actions = []

    await saveAction(actions, mockTransaction)

    expect(db.action.bulkCreate).not.toHaveBeenCalled()
  })
})
