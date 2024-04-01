const getTotal = require('../../../../../app/processing/sfi-23-quarterly-statement/total/get-total')

jest.mock('../../../../../app/processing/sfi-23-quarterly-statement/total/get-total-by-calculation-id')
const getTotalByCalculationId = require('../../../../../app/processing/sfi-23-quarterly-statement/total/get-total-by-calculation-id')

jest.mock('../../../../../app/processing/sfi-23-quarterly-statement/total/validate-total')
const validateTotal = require('../../../../../app/processing/sfi-23-quarterly-statement/total/validate-total')

describe('getTotal', () => {
  const calculationId = '12345'
  const total = 100

  beforeEach(() => {
    getTotalByCalculationId.mockResolvedValue(total)
    validateTotal.mockReturnValue(total)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getTotalByCalculationId with the correct calculationId', async () => {
    await getTotal(calculationId)

    expect(getTotalByCalculationId).toHaveBeenCalledWith(calculationId)
  })

  test('should call validateTotal with the correct total and calculationId', async () => {
    await getTotal(calculationId)

    expect(validateTotal).toHaveBeenCalledWith(total, calculationId)
  })

  test('should return the validated total', async () => {
    const result = await getTotal(calculationId)

    expect(result).toBe(total)
  })
})
