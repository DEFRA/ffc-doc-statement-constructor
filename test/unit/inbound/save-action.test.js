const db = require('../../../app/data')
const saveAction = require('../../../app/inbound/total/save-actions')

jest.mock('../../../app/data', () => ({
  action: {
    create: jest.fn()
  }
}))

describe('saveAction', () => {
  const mockTransaction = { id: 'mockTransaction' }
  const calculationId = '12345678901'
  const actions = [
    { id: 'action1', name: 'Action 1' },
    { id: 'action2', name: 'Action 2' }
  ]

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should save actions and return nothing', async () => {
    await saveAction(actions, calculationId, mockTransaction)

    expect(db.action.create).toHaveBeenCalledTimes(actions.length)
    actions.forEach(action => {
      expect(db.action.create).toHaveBeenCalledWith(
        { ...action, calculationId },
        { transaction: mockTransaction }
      )
    })
  })

  test('should throw an error if saving an action fails', async () => {
    const errorMessage = 'save error'
    const error = new Error(errorMessage)
    db.action.create.mockRejectedValueOnce(error)
    await expect(saveAction(actions, calculationId, mockTransaction)).rejects.toThrow(errorMessage)
  })
})
