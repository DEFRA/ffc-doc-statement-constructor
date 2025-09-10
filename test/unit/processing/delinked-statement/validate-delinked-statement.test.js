jest.mock('../../../../app/processing/delinked-statement/delinked-statement-schema')
jest.mock('../../../../app/utility/processing-alerts')

const schema = require('../../../../app/processing/delinked-statement/delinked-statement-schema')
const { dataProcessingAlert } = require('../../../../app/utility/processing-alerts')
const validateDelinkedStatement = require('../../../../app/processing/delinked-statement/validate-delinked-statement')

describe('validateDelinkedStatement', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    console.error = jest.fn()
  })

  test('should return validated value for a valid delinked statement', async () => {
    const mockDelinkedStatement = { calculationId: '12345', validField: 'value' }
    schema.validate.mockReturnValue({ value: mockDelinkedStatement })

    const result = await validateDelinkedStatement(mockDelinkedStatement)

    expect(result).toEqual(mockDelinkedStatement)
    expect(schema.validate).toHaveBeenCalledWith(mockDelinkedStatement, { abortEarly: false })
  })

  test('should log an error if the dataProcessingAlert fails', async () => {
    const mockDelinkedStatement = { calculationId: '12345', invalidField: 'value' }
    const mockError = new Error('Validation failed')
    schema.validate.mockReturnValue({ error: mockError })
    const mockAlertError = new Error('Alert failed')
    dataProcessingAlert.mockReturnValue(Promise.reject(mockAlertError))

    await expect(validateDelinkedStatement(mockDelinkedStatement)).rejects.toThrow(
      `Delinked statement with the CalculationId: ${mockDelinkedStatement.calculationId} does not have the required details data: Validation failed`
    )

    expect(console.error).toHaveBeenCalledWith(
      `Delinked statement with the CalculationId: ${mockDelinkedStatement.calculationId} does not have the required details data:`,
      { originalError: mockError.message, alertError: mockAlertError }
    )
  })
})
