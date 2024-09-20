const { getLatestInProgressPaymentRequest } = require('../../../../../app/processing/payment-request')
const { getSupportingSettlements, updateSettlementPaymentRequestId } = require('../../../../../app/processing/settlement')

const getLatestPaymentValue = require('../../../../../app/processing/sfi-23-quarterly-statement/value-override/get-latest-payment-value')
const getPreviousSettlement = require('../../../../../app/processing/sfi-23-quarterly-statement/value-override/get-previous-settlement')
const { getAmountFromSettlements } = require('../../../../../app/processing/sfi-23-quarterly-statement/value-override/get-amount-from-settlements')
const getSettlementByPaymentReference = require('../../../../../app/processing/sfi-23-quarterly-statement/value-override/get-settlement-by-payment-reference')

jest.mock('../../../../../app/processing/payment-request')
jest.mock('../../../../../app/processing/settlement')
jest.mock('../../../../../app/processing/sfi-23-quarterly-statement/value-override/get-latest-payment-value')
jest.mock('../../../../../app/processing/sfi-23-quarterly-statement/value-override/get-previous-settlement')
jest.mock('../../../../../app/processing/sfi-23-quarterly-statement/value-override/get-settlement-by-payment-reference')

describe('get amount from settlements', () => {
  test('should return latest payment value when no previous settlement', async () => {
    const mockSettlement = { paymentRequestId: 'PR123', settlementDate: '2023-01-01', value: 100, invoiceNumber: 'INV123', reference: 'REF123' }
    const mockLatestPaymentRequest = { agreementNumber: 'AGR123', year: 2023 }
    const mockSupportingSettlements = [{ value: 50 }]

    getSettlementByPaymentReference.mockResolvedValue(mockSettlement)
    getPreviousSettlement.mockResolvedValue(null)
    getLatestInProgressPaymentRequest.mockResolvedValue(mockLatestPaymentRequest)
    getSupportingSettlements.mockResolvedValue(mockSupportingSettlements)
    getLatestPaymentValue.mockReturnValue(100)

    const result = await getAmountFromSettlements('REF123')

    expect(getSettlementByPaymentReference).toHaveBeenCalledWith('REF123')
    expect(getPreviousSettlement).toHaveBeenCalledWith('2023-01-01', 100, 'INV123', 'REF123')
    expect(getLatestInProgressPaymentRequest).toHaveBeenCalledWith('PR123', '2023-01-01')
    expect(getSupportingSettlements).toHaveBeenCalledWith('2023-01-01', 'AGR123', 2023)
    expect(getLatestPaymentValue).toHaveBeenCalledWith(mockSettlement, mockSupportingSettlements)
    expect(result).toBe(100)
  })

  test('should update settlement payment request ID if not present', async () => {
    const mockSettlement = { paymentRequestId: null, settlementDate: '2023-01-01', value: 100, invoiceNumber: 'INV123', reference: 'REF123' }
    const updatedSettlement = { ...mockSettlement, paymentRequestId: 'PR456' }
    const mockLatestPaymentRequest = { agreementNumber: 'AGR123', year: 2023 }
    const mockSupportingSettlements = [{ value: 50 }]

    getSettlementByPaymentReference.mockResolvedValue(mockSettlement)
    updateSettlementPaymentRequestId.mockResolvedValue(updatedSettlement)
    getPreviousSettlement.mockResolvedValue(null)
    getLatestInProgressPaymentRequest.mockResolvedValue(mockLatestPaymentRequest)
    getSupportingSettlements.mockResolvedValue(mockSupportingSettlements)
    getLatestPaymentValue.mockReturnValue(150)

    const result = await getAmountFromSettlements('REF123')

    expect(getSettlementByPaymentReference).toHaveBeenCalledWith('REF123')
    expect(updateSettlementPaymentRequestId).toHaveBeenCalledWith(mockSettlement)
    expect(getPreviousSettlement).toHaveBeenCalledWith('2023-01-01', 100, 'INV123', 'REF123')
    expect(getLatestInProgressPaymentRequest).toHaveBeenCalledWith('PR456', '2023-01-01')
    expect(getSupportingSettlements).toHaveBeenCalledWith('2023-01-01', 'AGR123', 2023)
    expect(getLatestPaymentValue).toHaveBeenCalledWith(updatedSettlement, mockSupportingSettlements)
    expect(result).toBe(150)
  })

  test('should adjust settlement value if previous settlement exists', async () => {
    const mockSettlement = { paymentRequestId: 'PR123', settlementDate: '2023-01-01', value: 200, invoiceNumber: 'INV123', reference: 'REF123' }
    const mockPreviousSettlement = { value: 50 }
    const adjustedSettlement = { ...mockSettlement, value: 150 }
    const mockLatestPaymentRequest = { agreementNumber: 'AGR123', year: 2023 }
    const mockSupportingSettlements = [{ value: 50 }]

    getSettlementByPaymentReference.mockResolvedValue(mockSettlement)
    getPreviousSettlement.mockResolvedValue(mockPreviousSettlement)
    getLatestInProgressPaymentRequest.mockResolvedValue(mockLatestPaymentRequest)
    getSupportingSettlements.mockResolvedValue(mockSupportingSettlements)
    getLatestPaymentValue.mockReturnValue(200)

    const result = await getAmountFromSettlements('REF123')

    expect(getSettlementByPaymentReference).toHaveBeenCalledWith('REF123')
    expect(getPreviousSettlement).toHaveBeenCalledWith('2023-01-01', 200, 'INV123', 'REF123')
    expect(getLatestInProgressPaymentRequest).toHaveBeenCalledWith('PR123', '2023-01-01')
    expect(getSupportingSettlements).toHaveBeenCalledWith('2023-01-01', 'AGR123', 2023)
    expect(getLatestPaymentValue).toHaveBeenCalledWith(adjustedSettlement, mockSupportingSettlements)
    expect(result).toBe(200)
  })
})
