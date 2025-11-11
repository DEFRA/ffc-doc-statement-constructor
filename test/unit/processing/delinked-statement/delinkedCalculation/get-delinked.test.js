const getDelinked = require('../../../../../app/processing/delinked-statement/delinkedCalculation/get-delinked')

jest.mock('../../../../../app/processing/delinked-statement/delinkedCalculation/get-delinked-by-calculation-id')
const getDelinkedByCalculationId = require('../../../../../app/processing/delinked-statement/delinkedCalculation/get-delinked-by-calculation-id')

jest.mock('../../../../../app/processing/delinked-statement/delinkedCalculation/validate-delinked')
const validateDelinked = require('../../../../../app/processing/delinked-statement/delinkedCalculation/validate-delinked')

describe('getDelinked', () => {
  const calculationId = '12345'
  const delinkedMock = { id: 1, value: 100 }

  beforeEach(() => {
    getDelinkedByCalculationId.mockResolvedValue(delinkedMock)
    validateDelinked.mockReturnValue(delinkedMock)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('calls getDelinkedByCalculationId with the correct calculationId', async () => {
    await getDelinked(calculationId)
    expect(getDelinkedByCalculationId).toHaveBeenCalledWith(calculationId)
  })

  test('calls validateDelinked with the delinked record and calculationId', async () => {
    await getDelinked(calculationId)
    expect(validateDelinked).toHaveBeenCalledWith(delinkedMock, calculationId)
  })

  test('returns the validated delinked object', async () => {
    const result = await getDelinked(calculationId)
    expect(result).toBe(delinkedMock)
  })
})
