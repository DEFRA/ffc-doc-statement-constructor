const getActionGroups = require('../../../../../app/processing/sfi-23-quarterly-statement/action-groups/get-action-groups')

jest.mock('../../../../../app/processing/sfi-23-quarterly-statement/action-groups/get-actions')
const getActions = require('../../../../../app/processing/sfi-23-quarterly-statement/action-groups/get-actions')

jest.mock('../../../../../app/processing/sfi-23-quarterly-statement/action-groups/get-actions-groups-by-actions')
const getActionsGroupsByActions = require('../../../../../app/processing/sfi-23-quarterly-statement/action-groups/get-actions-groups-by-actions')

describe('getActionGroups', () => {
  test('should call getActions with the calculationReference', async () => {
    const calculationReference = '12345'

    await getActionGroups(calculationReference)

    expect(getActions).toHaveBeenCalledWith(calculationReference)
  })

  test('should call getActionsGroupsByActions with the actions returned by getActions', async () => {
    const calculationReference = '12345'
    const actions = ['action1', 'action2']
    getActions.mockResolvedValue(actions)

    await getActionGroups(calculationReference)

    expect(getActionsGroupsByActions).toHaveBeenCalledWith(actions)
  })

  test('should return the result of getActionsGroupsByActions', async () => {
    const calculationReference = '12345'
    const actionGroups = ['group1', 'group2']
    getActionsGroupsByActions.mockReturnValue(actionGroups)

    const result = await getActionGroups(calculationReference)

    expect(result).toEqual(actionGroups)
  })
})
