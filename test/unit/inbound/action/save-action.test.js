const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['actions'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const saveAction = require('../../../../app/inbound/total/save-actions')

describe('saveAction', () => {
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves()
  })

  test('inserts actions with references mapped to ids, against the transaction', async () => {
    const actions = [
      { actionReference: 'action1', calculationReference: 'calculation1', actionCode: 'AHL3', data: 'data1' },
      { actionReference: 'action2', calculationReference: 'calculation2', actionCode: 'AHL4', data: 'data2' }
    ]

    await saveAction(actions, transaction)

    expect(mockDb.tables.actions).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.insert).toHaveBeenCalledTimes(1)
    const [rows] = mockDb.builder.insert.mock.calls[0]
    expect(rows).toHaveLength(2)
    expect(rows[0]).toMatchObject({ actionId: 'action1', calculationId: 'calculation1', actionCode: 'AHL3' })
    expect(rows[1]).toMatchObject({ actionId: 'action2', calculationId: 'calculation2', actionCode: 'AHL4' })
  })

  test('only inserts columns that exist on the actions table', async () => {
    const actions = [{ actionReference: 'action1', calculationReference: 'calculation1', data: 'data1', type: 'total' }]

    await saveAction(actions, transaction)

    const [rows] = mockDb.builder.insert.mock.calls[0]
    expect(rows[0]).not.toHaveProperty('data')
    expect(rows[0]).not.toHaveProperty('type')
    expect(rows[0]).not.toHaveProperty('actionReference')
    expect(rows[0]).not.toHaveProperty('calculationReference')
  })

  test.each([
    ['empty array', []],
    ['undefined', undefined]
  ])('does not insert when actions is %s', async (_, actions) => {
    await saveAction(actions, transaction)

    expect(mockDb.tables.actions).not.toHaveBeenCalled()
    expect(mockDb.builder.insert).not.toHaveBeenCalled()
  })
})
