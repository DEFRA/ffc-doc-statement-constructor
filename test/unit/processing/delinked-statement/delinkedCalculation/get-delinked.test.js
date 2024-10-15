const getDelinked = require('../../../../../app/processing/delinked-statement/delinkedCalculation/get-delinked')

jest.mock('../../../../../app/processing/delinked-statement/delinkedCalculation/get-delinked-by-calculation-id')
const getDelinkedByCalculationId = require('../../../../../app/processing/delinked-statement/delinkedCalculation/get-delinked-by-calculation-id')

jest.mock('../../../../../app/processing/delinked-statement/delinkedCalculation/validate-delinked')
const validateDelinked = require('../../../../../app/processing/delinked-statement/delinkedCalculation/validate-delinked')

describe('getDelinked', () => {
  const calculationId = '12345'
  const delinked = 100

  beforeEach(() => {
    getDelinkedByCalculationId.mockResolvedValue(delinked)
    validateDelinked.mockReturnValue(delinked)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getDelinkedByCalculationId with the correct calculationId', async () => {
    await getDelinked(calculationId)

    expect(getDelinkedByCalculationId).toHaveBeenCalledWith(calculationId)
  })

  test('should call validateDelinked with the correct delinked and calculationId', async () => {
    await getDelinked(calculationId)

    expect(validateDelinked).toHaveBeenCalledWith(delinked, calculationId)
  })

  test('should return the validated delinked', async () => {
    const result = await getDelinked(calculationId)

    expect(result).toBe(delinked)
  })
})
