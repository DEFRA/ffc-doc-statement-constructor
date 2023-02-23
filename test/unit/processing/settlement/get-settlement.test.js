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

jest.mock('../../../../app/processing/settlement/get-settled-settlement-by-settlement-id')
const getSettledSettlementBySettlementId = require('../../../../app/processing/settlement/get-settled-settlement-by-settlement-id')

jest.mock('../../../../app/processing/settlement/update-settlement-payment-request-id')
const updateSettlementPaymentRequestId = require('../../../../app/processing/settlement/update-settlement-payment-request-id')

jest.mock('../../../../app/processing/settlement/get-last-settlement')
const getLastSettlement = require('../../../../app/processing/settlement/get-last-settlement')

jest.mock('../../../../app/processing/settlement/get-payment-value')
const getPaymentValue = require('../../../../app/processing/settlement/get-payment-value')

jest.mock('../../../../app/processing/settlement/validate-settlement')
const validateSettlement = require('../../../../app/processing/settlement/validate-settlement')

const getSettlement = require('../../../../app/processing/settlement/get-settlement')

let retrievedSettlement

describe('get required settlement information for building a statement object', () => {
  beforeEach(() => {
    const settlement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-settlement')))

    retrievedSettlement = {
      paymentRequestId: 1,
      reference: settlement.reference,
      settled: settlement.settled
    }

    validateSettlement.mockReturnValue(retrievedSettlement)
    getSettledSettlementBySettlementId.mockResolvedValue(retrievedSettlement)
    updateSettlementPaymentRequestId.mockResolvedValue(retrievedSettlement)
    getLastSettlement.mockResolvedValue(retrievedSettlement)
    getPaymentValue.mockReturnValue(settlement.paymentValue)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getSettledSettlementBySettlementId when a settlementId is given', async () => {
    const settlementId = 1
    await getSettlement(settlementId, mockTransaction)
    expect(getSettledSettlementBySettlementId).toHaveBeenCalled()
  })

  test('should call getSettledSettlementBySettlementId once when a settlementId is given', async () => {
    const settlementId = 1
    await getSettlement(settlementId)
    expect(getSettledSettlementBySettlementId).toHaveBeenCalledTimes(1)
  })

  test('should call getSettledSettlementBySettlementId with settlementId when a settlementId is given', async () => {
    const settlementId = 1
    await getSettlement(settlementId, mockTransaction)
    expect(getSettledSettlementBySettlementId).toHaveBeenCalledWith(settlementId, mockTransaction)
  })

  test('should call getLatestSettlement when a settlementId is given', async () => {
    const settlementId = 1
    await getSettlement(settlementId, mockTransaction)
    expect(getLastSettlement).toHaveBeenCalled()
  })

  test('should call getLatestSettlement once when a settlementId is given', async () => {
    const settlementId = 1
    await getSettlement(settlementId, mockTransaction)
    expect(getLastSettlement).toHaveBeenCalledTimes(1)
  })

  test('should call getLatestSettlement with settlementDate, value and invoiceNumber when a settlementId is given', async () => {
    const settlementId = 1
    await getSettlement(settlementId, mockTransaction)
    expect(getLastSettlement).toHaveBeenCalledWith(retrievedSettlement.settlementDate, retrievedSettlement.value, retrievedSettlement.invoiceNumber, mockTransaction)
  })

  test('should call getPaymentValue when a settlementId is given', async () => {
    const settlementId = 1
    await getSettlement(settlementId, mockTransaction)
    expect(getPaymentValue).toHaveBeenCalled()
  })

  test('should call getPaymentValue once when a settlementId is given', async () => {
    const settlementId = 1
    await getSettlement(settlementId, mockTransaction)
    expect(getPaymentValue).toHaveBeenCalledTimes(1)
  })

  test('should call getPaymentValue with value and last settlement value when a settlementId is given', async () => {
    const settlementId = 1
    await getSettlement(settlementId, mockTransaction)
    expect(getPaymentValue).toHaveBeenCalledWith(retrievedSettlement.value, retrievedSettlement.value)
  })

  test('should call validateSettlement when a settlementId is given', async () => {
    const settlementId = 1
    await getSettlement(settlementId)
    expect(validateSettlement).toHaveBeenCalled()
  })

  test('should call validateSettlement once when a settlementId is given', async () => {
    const settlementId = 1
    await getSettlement(settlementId)
    expect(validateSettlement).toHaveBeenCalledTimes(1)
  })

  test('should call validateSettlement with retrievedSettlement when a settlementId is given', async () => {
    const settlementId = 1
    await getSettlement(settlementId)
    expect(validateSettlement).toHaveBeenCalledWith(retrievedSettlement)
  })

  test('should return retrievedSettlement when a settlementId is given', async () => {
    const settlementId = 1
    const result = await getSettlement(settlementId)
    expect(result).toStrictEqual(retrievedSettlement)
  })

  test('should throw when getSettledSettlementBySettlementId throws', async () => {
    const settlementId = 1
    getSettledSettlementBySettlementId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getSettlement(settlementId)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when getSettledSettlementBySettlementId throws Error', async () => {
    const settlementId = 1
    getSettledSettlementBySettlementId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getSettlement(settlementId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database retrieval issue" when getSettledSettlementBySettlementId throws error with "Database retrieval issue"', async () => {
    const settlementId = 1
    getSettledSettlementBySettlementId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getSettlement(settlementId)
    }

    expect(wrapper).rejects.toThrow(/^Database retrieval issue$/)
  })

  test('should not call validateSettlement when getSettledSettlementBySettlementId throws', async () => {
    const settlementId = 1
    getSettledSettlementBySettlementId.mockRejectedValue(new Error('Database retrieval issue'))

    try { await getSettlement(settlementId) } catch {}

    expect(validateSettlement).not.toHaveBeenCalled()
  })

  test('should throw when validateSettlement throws', async () => {
    const settlementId = 1
    validateSettlement.mockImplementation(() => { throw new Error('Joi validation issue') })

    const wrapper = async () => {
      await getSettlement(settlementId)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when validateSettlement throws Error', async () => {
    const settlementId = 1
    validateSettlement.mockImplementation(() => { throw new Error('Joi validation issue') })

    const wrapper = async () => {
      await getSettlement(settlementId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Joi validation issue" when validateSettlement throws error with "Joi validation issue"', async () => {
    const settlementId = 1
    validateSettlement.mockImplementation(() => { throw new Error('Joi validation issue') })

    const wrapper = async () => {
      await getSettlement(settlementId)
    }

    expect(wrapper).rejects.toThrow(/^Joi validation issue$/)
  })
})
