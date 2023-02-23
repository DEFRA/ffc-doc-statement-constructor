const mockCommit = jest.fn()
const mockRollback = jest.fn()
const mockTransaction = {
  commit: mockCommit,
  rollback: mockRollback
}

const { IN_PROGRESS } = require('../../../app/constants/statuses')

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

jest.mock('../../../app/inbound/processing/get-in-progress-payment-request-by-invoice-number')
const getInProgressPaymentRequestByInvoiceNumber = require('../../../app/inbound/processing/get-in-progress-payment-request-by-invoice-number')

jest.mock('../../../app/inbound/save-invoice-number')
const saveInvoiceNumber = require('../../../app/inbound/save-invoice-number')

jest.mock('../../../app/inbound/save-payment-request')
const savePaymentRequest = require('../../../app/inbound/save-payment-request')

jest.mock('../../../app/inbound/save-invoice-lines')
const saveInvoiceLines = require('../../../app/inbound/save-invoice-lines')

const processProcessingPaymentRequest = require('../../../app/inbound/processing')

let paymentRequest

describe('process processing payment request', () => {
  beforeEach(() => {
    paymentRequest = JSON.parse(JSON.stringify(require('../../mock-objects/mock-payment-request').processingPaymentRequest))

    getInProgressPaymentRequestByInvoiceNumber.mockResolvedValue(null)
    saveInvoiceNumber.mockResolvedValue(undefined)
    savePaymentRequest.mockResolvedValue(paymentRequest)
    saveInvoiceLines.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getInProgressPaymentRequestByInvoiceNumber when a valid paymentRequest is given and a previous paymentRequest does not exist', async () => {
    await processProcessingPaymentRequest(paymentRequest)
    expect(getInProgressPaymentRequestByInvoiceNumber).toHaveBeenCalled()
  })

  test('should call getInProgressPaymentRequestByInvoiceNumber once when a valid paymentRequest is given and a previous paymentRequest does not exist', async () => {
    await processProcessingPaymentRequest(paymentRequest)
    expect(getInProgressPaymentRequestByInvoiceNumber).toHaveBeenCalledTimes(1)
  })

  test('should call getInProgressPaymentRequestByInvoiceNumber with paymentRequest.invoiceNumber and mockTransaction when a valid paymentRequest is given and a previous paymentRequest does not exist', async () => {
    await processProcessingPaymentRequest(paymentRequest)
    expect(getInProgressPaymentRequestByInvoiceNumber).toHaveBeenCalledWith(paymentRequest.invoiceNumber, mockTransaction)
  })

  test('should call saveInvoiceNumber when a valid paymentRequest is given and a previous paymentRequest does not exist', async () => {
    await processProcessingPaymentRequest(paymentRequest)
    expect(saveInvoiceNumber).toHaveBeenCalled()
  })

  test('should call saveInvoiceNumber once when a valid paymentRequest is given and a previous paymentRequest does not exist', async () => {
    await processProcessingPaymentRequest(paymentRequest)
    expect(saveInvoiceNumber).toHaveBeenCalledTimes(1)
  })

  test('should call saveInvoiceNumber with paymentRequest.invoiceNumber and mockTransaction when a valid paymentRequest is given and a previous paymentRequest does not exist', async () => {
    await processProcessingPaymentRequest(paymentRequest)
    expect(saveInvoiceNumber).toHaveBeenCalledWith(paymentRequest.invoiceNumber, mockTransaction)
  })

  test('should call savePaymentRequest when a valid paymentRequest is given and a previous paymentRequest does not exist', async () => {
    await processProcessingPaymentRequest(paymentRequest)
    expect(savePaymentRequest).toHaveBeenCalled()
  })

  test('should call savePaymentRequest once when a valid paymentRequest is given and a previous paymentRequest does not exist', async () => {
    await processProcessingPaymentRequest(paymentRequest)
    expect(savePaymentRequest).toHaveBeenCalledTimes(1)
  })

  test('should call savePaymentRequest with paymentRequest with status: IN_PROGRESS and mockTransaction when a valid paymentRequest is given and a previous paymentRequest does not exist', async () => {
    await processProcessingPaymentRequest(paymentRequest)
    expect(savePaymentRequest).toHaveBeenCalledWith({ ...paymentRequest, status: IN_PROGRESS }, mockTransaction)
  })

  test('should call saveInvoiceLines when a valid paymentRequest is given and a previous paymentRequest does not exist', async () => {
    await processProcessingPaymentRequest(paymentRequest)
    expect(saveInvoiceLines).toHaveBeenCalled()
  })

  test('should call saveInvoiceLines once when a valid paymentRequest is given and a previous paymentRequest does not exist', async () => {
    await processProcessingPaymentRequest(paymentRequest)
    expect(saveInvoiceLines).toHaveBeenCalledTimes(1)
  })

  test('should call saveInvoiceLines with paymentRequest.invoiceLines, paymentRequest.paymentRequestId and mockTransaction when a valid paymentRequest is given and a previous paymentRequest does not exist', async () => {
    await processProcessingPaymentRequest(paymentRequest)
    expect(saveInvoiceLines).toHaveBeenCalledWith(paymentRequest.invoiceLines, paymentRequest.paymentRequestId, mockTransaction)
  })

  test('should call mockTransaction.commit when a valid paymentRequest is given and a previous paymentRequest does not exist', async () => {
    await processProcessingPaymentRequest(paymentRequest)
    expect(mockTransaction.commit).toHaveBeenCalled()
  })

  test('should call mockTransaction.commit once when a valid paymentRequest is given and a previous paymentRequest does not exist', async () => {
    await processProcessingPaymentRequest(paymentRequest)
    expect(mockTransaction.commit).toHaveBeenCalledTimes(1)
  })

  test('should not call mockTransaction.rollback when a valid paymentRequest is given and a previous paymentRequest does not exist and nothing throws', async () => {
    await processProcessingPaymentRequest(paymentRequest)
    expect(mockTransaction.rollback).not.toHaveBeenCalled()
  })

  test('should call getInProgressPaymentRequestByInvoiceNumber when a valid paymentRequest is given and a previous paymentRequest exist', async () => {
    getInProgressPaymentRequestByInvoiceNumber.mockResolvedValue(paymentRequest)
    await processProcessingPaymentRequest(paymentRequest)
    expect(getInProgressPaymentRequestByInvoiceNumber).toHaveBeenCalled()
  })

  test('should call getInProgressPaymentRequestByInvoiceNumber once when a valid paymentRequest is given and a previous paymentRequest exist', async () => {
    getInProgressPaymentRequestByInvoiceNumber.mockResolvedValue(paymentRequest)
    await processProcessingPaymentRequest(paymentRequest)
    expect(getInProgressPaymentRequestByInvoiceNumber).toHaveBeenCalledTimes(1)
  })

  test('should call getInProgressPaymentRequestByInvoiceNumber with paymentRequest.invoiceNumber and mockTransaction when a valid paymentRequest is given and a previous paymentRequest does not exist', async () => {
    getInProgressPaymentRequestByInvoiceNumber.mockResolvedValue(paymentRequest)
    await processProcessingPaymentRequest(paymentRequest)
    expect(getInProgressPaymentRequestByInvoiceNumber).toHaveBeenCalledWith(paymentRequest.invoiceNumber, mockTransaction)
  })

  test('should call mockTransaction.rollback when a valid paymentRequest is given and a previous paymentRequest exist', async () => {
    getInProgressPaymentRequestByInvoiceNumber.mockResolvedValue(paymentRequest)
    await processProcessingPaymentRequest(paymentRequest)
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when a valid paymentRequest is given and a previous paymentRequest exist', async () => {
    getInProgressPaymentRequestByInvoiceNumber.mockResolvedValue(paymentRequest)
    await processProcessingPaymentRequest(paymentRequest)
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should throw when getInProgressPaymentRequestByInvoiceNumber throws', async () => {
    getInProgressPaymentRequestByInvoiceNumber.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await processProcessingPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when getInProgressPaymentRequestByInvoiceNumber throws Error', async () => {
    getInProgressPaymentRequestByInvoiceNumber.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await processProcessingPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database retrieval issue" when getInProgressPaymentRequestByInvoiceNumber throws error with "Database retrieval issue"', async () => {
    getInProgressPaymentRequestByInvoiceNumber.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await processProcessingPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow(/^Database retrieval issue$/)
  })

  test('should throw when saveInvoiceNumber throws', async () => {
    saveInvoiceNumber.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processProcessingPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when saveInvoiceNumber throws Error', async () => {
    saveInvoiceNumber.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processProcessingPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database save down issue" when saveInvoiceNumber throws error with "Database save down issue"', async () => {
    saveInvoiceNumber.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processProcessingPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow(/^Database save down issue$/)
  })

  test('should throw when savePaymentRequest throws', async () => {
    savePaymentRequest.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processProcessingPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when savePaymentRequest throws Error', async () => {
    savePaymentRequest.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processProcessingPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database save down issue" when savePaymentRequest throws error with "Database save down issue"', async () => {
    savePaymentRequest.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processProcessingPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow(/^Database save down issue$/)
  })

  test('should throw when saveInvoiceLines throws', async () => {
    saveInvoiceLines.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processProcessingPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when saveInvoiceLines throws Error', async () => {
    saveInvoiceLines.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processProcessingPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database save down issue" when saveInvoiceLines throws error with "Database save down issue"', async () => {
    saveInvoiceLines.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processProcessingPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow(/^Database save down issue$/)
  })

  test('should throw when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))

    const wrapper = async () => {
      await processProcessingPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when mockTransaction.commit throws Error', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))

    const wrapper = async () => {
      await processProcessingPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Sequelize transaction issue" when mockTransaction.commit throws error with "Sequelize transaction commit issue"', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))

    const wrapper = async () => {
      await processProcessingPaymentRequest(paymentRequest)
    }

    expect(wrapper).rejects.toThrow(/^Sequelize transaction commit issue$/)
  })

  test('should call mockTransaction.rollback when getInProgressPaymentRequestByInvoiceNumber throws', async () => {
    getInProgressPaymentRequestByInvoiceNumber.mockRejectedValue(new Error('Database retrieval issue'))
    try { await processProcessingPaymentRequest(paymentRequest) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when getInProgressPaymentRequestByInvoiceNumber throws', async () => {
    getInProgressPaymentRequestByInvoiceNumber.mockRejectedValue(new Error('Database retrieval issue'))
    try { await processProcessingPaymentRequest(paymentRequest) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should call mockTransaction.rollback when saveInvoiceNumber throws', async () => {
    saveInvoiceNumber.mockRejectedValue(new Error('Database save down issue'))
    try { await processProcessingPaymentRequest(paymentRequest) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when saveInvoiceNumber throws', async () => {
    saveInvoiceNumber.mockRejectedValue(new Error('Database save down issue'))
    try { await processProcessingPaymentRequest(paymentRequest) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should call mockTransaction.rollback when savePaymentRequest throws', async () => {
    savePaymentRequest.mockRejectedValue(new Error('Database save down issue'))
    try { await processProcessingPaymentRequest(paymentRequest) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when savePaymentRequest throws', async () => {
    savePaymentRequest.mockRejectedValue(new Error('Database save down issue'))
    try { await processProcessingPaymentRequest(paymentRequest) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should call mockTransaction.rollback when saveInvoiceLines throws', async () => {
    saveInvoiceLines.mockRejectedValue(new Error('Database save down issue'))
    try { await processProcessingPaymentRequest(paymentRequest) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when saveInvoiceLines throws', async () => {
    saveInvoiceLines.mockRejectedValue(new Error('Database save down issue'))
    try { await processProcessingPaymentRequest(paymentRequest) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should call mockTransaction.rollback when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))
    try { await processProcessingPaymentRequest(paymentRequest) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))
    try { await processProcessingPaymentRequest(paymentRequest) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })
})
