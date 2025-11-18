const db = require('../../../../../app/data')
const getActionsByCalculationReference = require('../../../../../app/processing/sfi-23-quarterly-statement/action-groups/get-actions-by-calculation-reference')

const calculationIdOne = 11235452
const calculationIdTwo = 76726627

let actions

describe('getActionsByCalculationReference', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({ cascade: true, restartIdentity: true })
  })

  beforeEach(async () => {
    const organisation = structuredClone(require('../../../../mock-objects/mock-organisation'))
    const total = structuredClone(require('../../../../mock-objects/mock-total'))
    const action = structuredClone(require('../../../../mock-objects/mock-action'))

    const totals = [
      { ...total, calculationId: calculationIdOne, claimId: total.claimReference },
      { ...total, calculationId: calculationIdTwo, claimId: total.claimReference }
    ]

    actions = [
      { ...action, actionId: 1, calculationId: calculationIdOne },
      { ...action, actionId: 2, calculationId: calculationIdOne },
      { ...action, actionId: 3, calculationId: calculationIdOne },
      { ...action, actionId: 4, calculationId: calculationIdTwo },
      { ...action, actionId: 5, calculationId: calculationIdTwo }
    ]

    await db.organisation.create(organisation)
    await db.total.bulkCreate(totals)
    await db.action.bulkCreate(actions)
  })

  afterEach(async () => {
    await db.sequelize.truncate({ cascade: true, restartIdentity: true })
  })

  afterAll(async () => {
    await db.sequelize.close()
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
})
