const getActionsGroupsByActions = require('../../../../../app/processing/sfi-23-quarterly-statement/action-groups/get-actions-groups-by-actions')
const groupBy = require('../../../../../app/processing/sfi-23-quarterly-statement/action-groups/group-by')

const groupOne = 'Hegrow group'
const groupTwo = 'Herb Group'

let actions

describe('process get calculation object', () => {
  beforeAll(async () => {

  })

  beforeEach(async () => {
    const action = structuredClone(require('../../../../mock-objects/mock-action'))

    actions = [
      { ...action, groupName: groupTwo },
      { ...action, groupName: groupOne },
      { ...action, groupName: groupOne },
      { ...action, groupName: groupTwo },
      { ...action, groupName: groupOne }
    ]
  })

  afterEach(async () => {
  })

  afterAll(async () => {
  })

  test('should return all actions in action db table that have provided calculationReference as calculationId', async () => {
    const actionGroups = await getActionsGroupsByActions(actions)
    const groupObjects = groupBy(actions, 'groupName')
    expect(actionGroups).toStrictEqual(Object.keys(groupObjects).map(key => ({ groupName: key, actions: groupObjects[key] })))
  })
})
