const mockCommit = jest.fn()
const mockRollback = jest.fn()
const mockTransaction = {
  commit: mockCommit,
  rollback: mockRollback
}

jest.mock('../../../app/data', () => {
  return {
    sequelize:
       {
         transaction: jest.fn().mockImplementation(() => {
           return { ...mockTransaction }
         })
       }
  }
})

jest.mock('../../../app/inbound/return/get-settlement-by-invoice-number-and-value')
const getSettlementByInvoiceNumberAndValue = require('../../../app/inbound/return/get-settlement-by-invoice-number-and-value')

jest.mock('../../../app/inbound/return/save-settlement')
const saveSettlement = require('../../../app/inbound/return/save-settlement')

jest.mock('../../../app/inbound/return/save-schedule')
const saveSchedule = require('../../../app/inbound/return/save-schedule')

const processReturnSettlement = require('../../../app/inbound/return')

let settlement

describe('process return settlement request', () => {
  beforeEach(() => {
    settlement = JSON.parse(JSON.stringify(require('../../mock-objects/mock-settlement')))

    getSettlementByInvoiceNumberAndValue.mockResolvedValue(undefined)
    saveSettlement.mockResolvedValue({ ...settlement, settlementId: 1 })
    saveSchedule.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getSettlementByInvoiceNumberAndValue when a valid settlement is given', async () => {
    await processReturnSettlement(settlement)
    expect(getSettlementByInvoiceNumberAndValue).toBeCalled()
  })

  test('should call getSettlementByInvoiceNumberAndValue once when a valid settlement is given', async () => {
    await processReturnSettlement(settlement)
    expect(getSettlementByInvoiceNumberAndValue).toBeCalledTimes(1)
  })

  test('should call getSettlementByInvoiceNumberAndValue with "settlement.invoiceNumber" and "mockTransaction" when valid settlement is given', async () => {
    await processReturnSettlement(settlement)
    expect(getSettlementByInvoiceNumberAndValue).toHaveBeenCalledWith(settlement.invoiceNumber, settlement.value, mockTransaction)
  })

  test('should throw when getSettlementByInvoiceNumberAndValue throws', async () => {
    getSettlementByInvoiceNumberAndValue.mockRejectedValue(new Error('Database retrieval issue'))
    const wrapper = async () => {
      await processReturnSettlement(settlement)
    }
    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when getSettlementByInvoiceNumberAndValue throws', async () => {
    getSettlementByInvoiceNumberAndValue.mockRejectedValue(new Error('Database retrieval issue'))
    const wrapper = async () => {
      await processReturnSettlement(settlement)
    }
    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error "Database retrieval issue" when getSettlementByInvoiceNumberAndValue throws "Database retrieval issue" error', async () => {
    getSettlementByInvoiceNumberAndValue.mockRejectedValue(new Error('Database retrieval issue'))
    const wrapper = async () => {
      await processReturnSettlement(settlement)
    }
    expect(wrapper).rejects.toThrow(Error('Database retrieval issue'))
  })

  test('should call mockTransaction.rollback when a duplicate settlement is found', async () => {
    getSettlementByInvoiceNumberAndValue.mockResolvedValue(settlement)
    await processReturnSettlement(settlement)
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when a duplicate settlement is found', async () => {
    getSettlementByInvoiceNumberAndValue.mockResolvedValue(settlement)
    await processReturnSettlement(settlement)
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should call mockTransaction.commit when no existing settlement is found', async () => {
    await processReturnSettlement(settlement)
    expect(mockTransaction.commit).toHaveBeenCalled()
  })

  test('should call mockTransaction.commit once when no existing settlement is found', async () => {
    await processReturnSettlement(settlement)
    expect(mockTransaction.commit).toHaveBeenCalledTimes(1)
  })

  test('should call saveSettlement when a valid settlement is given', async () => {
    await processReturnSettlement(settlement)
    expect(saveSettlement).toHaveBeenCalled()
  })

  test('should call saveSettlement once when a valid settlement is given', async () => {
    await processReturnSettlement(settlement)
    expect(saveSettlement).toHaveBeenCalledTimes(1)
  })

  test('should call saveSettlement with "settlement" and "mocktransaction"', async () => {
    await processReturnSettlement(settlement)
    expect(saveSettlement).toHaveBeenCalledWith(settlement, mockTransaction)
  })

  test('should throw when saveSettlement throws', async () => {
    saveSettlement.mockRejectedValue(new Error('Database save down issue'))
    const wrapper = async () => {
      await processReturnSettlement(settlement)
    }
    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when saveSettlement throws', async () => {
    saveSettlement.mockRejectedValue(new Error('Database save down issue'))
    const wrapper = async () => {
      await processReturnSettlement(settlement)
    }
    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error "Database save down issue" when saveSettlement throws error with "Database save down issue"', async () => {
    saveSettlement.mockRejectedValue(new Error('Database save down issue'))
    const wrapper = async () => {
      await processReturnSettlement(settlement)
    }
    expect(wrapper).rejects.toThrow(Error('Database save down issue'))
  })

  test('should call saveSchedule when a valid settlement is given', async () => {
    await processReturnSettlement(settlement)
    expect(saveSchedule).toHaveBeenCalled()
  })

  test('should call saveSchedule once when a valid settlement is given', async () => {
    await processReturnSettlement(settlement)
    expect(saveSchedule).toHaveBeenCalledTimes(1)
  })

  test('should call saveSchedule with "savedSettlement" and "mocktransaction"', async () => {
    await processReturnSettlement(settlement)
    expect(saveSchedule).toHaveBeenCalledWith({ ...settlement, settlementId: 1 }, mockTransaction)
  })

  test('should throw when saveSchedule throws', async () => {
    saveSchedule.mockRejectedValue(new Error('Database save down issue'))
    const wrapper = async () => {
      await processReturnSettlement(settlement)
    }
    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when saveSchedule throws', async () => {
    saveSchedule.mockRejectedValue(new Error('Database save down issue'))
    const wrapper = async () => {
      await processReturnSettlement(settlement)
    }
    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error "Database save down issue" when saveSchedule throws error with "Database save down issue"', async () => {
    saveSchedule.mockRejectedValue(new Error('Database save down issue'))
    const wrapper = async () => {
      await processReturnSettlement(settlement)
    }
    expect(wrapper).rejects.toThrow(Error('Database save down issue'))
  })
})
