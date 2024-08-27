const getActions = require('../../../../../app/processing/sfi-23-quarterly-statement/action-groups/get-actions')

jest.mock('../../../../../app/processing/sfi-23-quarterly-statement/action-groups/get-actions-by-calculation-reference')
const getActionsByCalculationReference = require('../../../../../app/processing/sfi-23-quarterly-statement/action-groups/get-actions-by-calculation-reference')

jest.mock('../../../../../app/processing/sfi-23-quarterly-statement/action-groups/validate-actions')
const validateActions = require('../../../../../app/processing/sfi-23-quarterly-statement/action-groups/validate-actions')

describe('getActions', () => {
  const calculationId = '123'

  test('should call getActionsByCalculationReference with the correct calculationId', async () => {
    await getActions(calculationId)

    expect(getActionsByCalculationReference).toHaveBeenCalledWith(calculationId)
  })

  test('should call validateActions with the actions and calculationId', async () => {
    const actions = ['action1', 'action2']
    getActionsByCalculationReference.mockResolvedValue(actions)

    await getActions(calculationId)

    expect(validateActions).toHaveBeenCalledWith(actions, calculationId)
  })

  test('should return the result of validateActions', async () => {
    const validatedActions = ['validatedAction1', 'validatedAction2']
    validateActions.mockReturnValue(validatedActions)

    const result = await getActions(calculationId)

    expect(result).toBe(validatedActions)
  })
})
