
const mockCommit = jest.fn()
const mockRollback = jest.fn()
const mockTransaction = {
  commit: mockCommit,
  rollback: mockRollback
}

jest.mock('../../../../app/data', () => {
  return {
    sequelize:
       {
         transaction: jest.fn().mockImplementation(() => {
           return { ...mockTransaction }
         })
       }
  }
})

jest.mock('../../../../app/processing/funding/get-fundings-by-calculation-id')
const getFundingsByCalculationId = require('../../../../app/processing/funding/get-fundings-by-calculation-id')

jest.mock('../../../../app/processing/funding/schema')
const schema = require('../../../../app/processing/funding/schema')

jest.mock('../../../../app/processing/funding/map-fundings')
const mapFundings = require('../../../../app/processing/funding/map-fundings')

const getFundings = require('../../../../app/processing/funding/get-fundings')

let fundings
let mappedFundings

describe('get and transform fundings object for building a statement object', () => {
  beforeEach(() => {
    fundings = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-fundings')))

    mappedFundings = [
      {
        area: fundings[0].areaClaimed,
        level: '',
        name: 'Moorland',
        rate: fundings[0].rate
      },
      {
        area: fundings[1].areaClaimed,
        level: 'Introductory',
        name: 'Arable and horticultural soils',
        rate: fundings[1].rate
      }
    ]

    getFundingsByCalculationId.mockResolvedValue(fundings)
    schema.validate.mockReturnValue({ value: fundings })
    mapFundings.mockResolvedValue(mappedFundings)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getFundingsByCalculationId when a calculationId is given', async () => {
    const calculationId = 1
    await getFundings(calculationId)
    expect(getFundingsByCalculationId).toHaveBeenCalled()
  })

  test('should call getFundingsByCalculationId once when a calculationId is given', async () => {
    const calculationId = 1
    await getFundings(calculationId)
    expect(getFundingsByCalculationId).toHaveBeenCalledTimes(1)
  })

  test('should call getFundingsByCalculationId with calculationId and mockTransaction when a calculationId is given', async () => {
    const calculationId = 1
    await getFundings(calculationId, mockTransaction)
    expect(getFundingsByCalculationId).toHaveBeenCalledWith(calculationId, mockTransaction)
  })

  test('should call schema.validate when a calculationId is given', async () => {
    const calculationId = 1
    await getFundings(calculationId)
    expect(schema.validate).toHaveBeenCalled()
  })

  test('should call schema.validate once when a calculationId is given', async () => {
    const calculationId = 1
    await getFundings(calculationId)
    expect(schema.validate).toHaveBeenCalledTimes(1)
  })

  test('should call mapFundings with fundings when a calculationId is given', async () => {
    const calculationId = 1
    await getFundings(calculationId)
    expect(mapFundings).toHaveBeenCalledWith(fundings)
  })

  test('should call schema.validate with mappedFundings and { abortEarly: false } when a calculationId is given', async () => {
    const calculationId = 1
    await getFundings(calculationId)
    expect(schema.validate).toHaveBeenCalledWith(mappedFundings, { abortEarly: false })
  })

  test('should throw when getFundingsByCalculationId throws', async () => {
    const calculationId = 1
    getFundingsByCalculationId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getFundings(calculationId)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when getFundingsByCalculationId throws Error', async () => {
    const calculationId = 1
    getFundingsByCalculationId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getFundings(calculationId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should not call schema.validate when getFundingsByCalculationId throws', async () => {
    const calculationId = 1
    getFundingsByCalculationId.mockRejectedValue(new Error('Database retrieval issue'))

    try { await getFundings(calculationId) } catch {}

    expect(schema.validate).not.toHaveBeenCalled()
  })

  test('should throw when schema.validate returns with error key', async () => {
    const calculationId = 1
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      await getFundings(calculationId)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when schema.validate returns with error key', async () => {
    const calculationId = 1
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      await getFundings(calculationId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error which starts "Calculation with calculationId: 1 does not have valid funding(s)" when schema.validate returns with error key of "Not a valid object"', async () => {
    const calculationId = 1
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      await getFundings(calculationId)
    }

    expect(wrapper).rejects.toThrow(/^Calculation with calculationId: 1 does not have valid funding/)
  })

  test('should return all records retrieved from database when getFundingsByCalculationId and all retrieved records are valid', async () => {
    const calculationId = 1
    const fundings = await getFundings(calculationId)
    expect(fundings.length).toBe(fundings.length)
  })

  test('should return areas attribute for all records retrieved from database when getFundingsByCalculationId and all retrieved records are valid', async () => {
    const calculationId = 1
    const fundings = await getFundings(calculationId)
    const areas = fundings.filter(funding => funding.area !== undefined).map(funding => funding.area)
    expect(areas.length).toBe(fundings.length)
  })

  test('should return rate attribute for all records retrieved from database when getFundingsByCalculationId and all retrieved records are valid', async () => {
    const calculationId = 1
    const fundings = await getFundings(calculationId)
    const rates = fundings.filter(funding => funding.rate !== undefined).map(funding => funding.rate)
    expect(rates.length).toBe(fundings.length)
  })

  test('should not return areaClaimed as attribute for any record retrieved from database when getFundingsByCalculationId and all retrieved records are valid', async () => {
    const calculationId = 1
    const fundings = await getFundings(calculationId)
    const areasClaimed = fundings.filter(funding => funding.areaClaimed !== undefined).map(funding => funding.areaClaimed)
    expect(areasClaimed.length).toBe(0)
  })
})
