jest.mock('../../../../app/processing/delinked-statement/delinked-statement-schema')
jest.mock('../../../../app/utility/processing-alerts')

const schema = require('../../../../app/processing/delinked-statement/delinked-statement-schema')
const validateDelinkedStatement = require('../../../../app/processing/delinked-statement/validate-delinked-statement')

describe('validateDelinkedStatement', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    console.error = jest.fn()
  })

  test('should return validated value for a valid delinked statement', () => {
    const mockDelinkedStatement = { calculationId: '12345', validField: 'value' }
    schema.validate.mockReturnValue({ value: mockDelinkedStatement })

    const result = validateDelinkedStatement(mockDelinkedStatement)

    expect(result).toEqual(mockDelinkedStatement)
    expect(schema.validate).toHaveBeenCalledWith(mockDelinkedStatement, { abortEarly: false })
  })
})
