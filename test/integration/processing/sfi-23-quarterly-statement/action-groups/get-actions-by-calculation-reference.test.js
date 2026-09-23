const db = require('../../../../../app/database')
const { truncate } = require('../../../../helpers/truncate')
const getActionsByCalculationReference = require('../../../../../app/processing/sfi-23-quarterly-statement/action-groups/get-actions-by-calculation-reference')

const calculationIdOne = 11235452
const calculationIdTwo = 76726627

describe('getActionsByCalculationReference', () => {
  beforeAll(async () => {
    await truncate()
  })

  beforeEach(async () => {
    const { type, ...organisation } = structuredClone(require('../../../../mock-objects/mock-organisation'))
    const { calculationReference, claimReference, actions: _actions, type: _type, ...total } = structuredClone(require('../../../../mock-objects/mock-total'))
    const { actionReference, calculationReference: _calculationReference, ...action } = structuredClone(require('../../../../mock-objects/mock-action'))

    const totals = [
      { ...total, calculationId: calculationIdOne, claimId: claimReference },
      { ...total, calculationId: calculationIdTwo, claimId: claimReference }
    ]

    const actions = [
      { ...action, actionId: 1, calculationId: calculationIdOne },
      { ...action, actionId: 2, calculationId: calculationIdOne },
      { ...action, actionId: 3, calculationId: calculationIdOne },
      { ...action, actionId: 4, calculationId: calculationIdTwo },
      { ...action, actionId: 5, calculationId: calculationIdTwo }
    ]

    await db.organisations().insert(organisation)
    await db.totals().insert(totals)
    await db.actions().insert(actions)
  })

  afterEach(async () => {
    await truncate()
  })

  afterAll(async () => {
    await db.close()
  })

  test.each([
    [calculationIdOne, 3],
    [calculationIdTwo, 2]
  ])(
    'should return all actions for calculation reference %s',
    async (calculationId, expectedCount) => {
      const retrievedActions = await getActionsByCalculationReference(calculationId)
      expect(retrievedActions).toHaveLength(expectedCount)
    }
  )

  test('aliases actionId and calculationId to their reference names', async () => {
    const [retrievedAction] = await getActionsByCalculationReference(calculationIdTwo)
    expect(retrievedAction).toMatchObject({ actionReference: 4, calculationReference: calculationIdTwo })
    expect(retrievedAction).not.toHaveProperty('actionId')
    expect(retrievedAction).not.toHaveProperty('calculationId')
  })
})
