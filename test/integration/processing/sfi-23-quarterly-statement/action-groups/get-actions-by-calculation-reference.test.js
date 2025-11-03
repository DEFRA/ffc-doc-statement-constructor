const db = require('../../../../../app/data')

const getActionsByCalculationReference = require('../../../../../app/processing/sfi-23-quarterly-statement/action-groups/get-actions-by-calculation-reference')

const calculationIdOne = 11235452
const calculationIdTwo = 76726627

let actions

describe('process get calculation object', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    const organisation = JSON.parse(JSON.stringify(require('../../../../mock-objects/mock-organisation')))
    const total = JSON.parse(JSON.stringify(require('../../../../mock-objects/mock-total')))
    const action = JSON.parse(JSON.stringify(require('../../../../mock-objects/mock-action')))

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
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  afterAll(async () => {
    await db.sequelize.close()
  })

  test('should return all actions in action db table that have provided calculationReference as calculationId', async () => {
    const retrievedActions = await getActionsByCalculationReference(calculationIdOne)
    expect(retrievedActions.length).toBe(3)
  })
})
