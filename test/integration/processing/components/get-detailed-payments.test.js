const getDetailedPayments = require('../../../../app/processing/components/get-detailed-payments')

let mockPaymentRequest
const mockSettlement = {}
const mockCalculation = {}

// expected date formats
// 'DD/MM/YYYY' 01/12/2022
// ddd MMM DD YYYY HH:mm:ss Tue Feb 08 2022 00:00:00

describe('format dates', () => {
  beforeEach(async () => {
    mockPaymentRequest = {}
  })
  // 1 December
  test('mockPaymentRequest dueDate with format of "DD/MM/YYYY" should return "1 December 2022"', async () => {
    mockPaymentRequest.dueDate = '01/12/2022'
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].dueDate).toBe('1 December 2022')
  })

  test('mockPaymentRequest dueDate with format of "DD-MM-YYYY" should return "1 December 2022"', async () => {
    mockPaymentRequest.dueDate = '01-12-2022'
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].dueDate).toBe('1 December 2022')
  })

  test('mockPaymentRequest dueDate with format of "D/MM/YYYY" should return "1 December 2022"', async () => {
    mockPaymentRequest.dueDate = '1/12/2022'
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].dueDate).toBe('1 December 2022')
  })

  test('mockPaymentRequest dueDate with format of "D/MM/YY" should return "1 December 2022"', async () => {
    mockPaymentRequest.dueDate = '1/12/22'
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].dueDate).toBe('1 December 2022')
  })

  test('mockPaymentRequest dueDate with format of "ddd MMMM DD YYYY HH:mm:ss" should return "1 December 2022"', async () => {
    mockPaymentRequest.dueDate = 'Thu Dec 01 2022 00:00:00 GMT+0000 (Greenwich Mean Time)'
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].dueDate).toBe('1 December 2022')
  })

  // 12 January
  test('mockPaymentRequest dueDate with format of "DD/MM/YYYY" should return "12 January 2022"', async () => {
    mockPaymentRequest.dueDate = '12/01/2022'
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].dueDate).toBe('12 January 2022')
  })

  test('mockPaymentRequest dueDate with format of "DD-MM-YYYY" should return "12 January 2022"', async () => {
    mockPaymentRequest.dueDate = '12-01-2022'
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].dueDate).toBe('12 January 2022')
  })

  test('mockPaymentRequest dueDate with format of "D/MM/YYYY" should return "12 January 2022"', async () => {
    mockPaymentRequest.dueDate = '12/01/2022'
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].dueDate).toBe('12 January 2022')
  })

  test('mockPaymentRequest dueDate with format of "D/MM/YY" should return "12 January 2022"', async () => {
    mockPaymentRequest.dueDate = '12/01/22'
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].dueDate).toBe('12 January 2022')
  })

  test('mockPaymentRequest dueDate with format of "ddd MMMM DD YYYY HH:mm:ss" should return "12 January 2022"', async () => {
    mockPaymentRequest.dueDate = 'Wed January 12 2022 00:00:00 GMT+0000 (Greenwich Mean Time)'
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].dueDate).toBe('12 January 2022')
  })

  // 1 June

  test('mockPaymentRequest dueDate with format of "DD/MM/YYYY" should return "1 June 2022"', async () => {
    mockPaymentRequest.dueDate = '01/06/2022'
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].dueDate).toBe('1 June 2022')
  })

  test('mockPaymentRequest dueDate with format of "DD-MM-YYYY" should return "1 June 2022"', async () => {
    mockPaymentRequest.dueDate = '01-06-2022'
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].dueDate).toBe('1 June 2022')
  })

  test('mockPaymentRequest dueDate with format of "D/MM/YYYY" should return "1 June 2022"', async () => {
    mockPaymentRequest.dueDate = '1/6/2022'
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].dueDate).toBe('1 June 2022')
  })

  test('mockPaymentRequest dueDate with format of "D/MM/YY" should return "1 June 2022"', async () => {
    mockPaymentRequest.dueDate = '1/06/22'
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].dueDate).toBe('1 June 2022')
  })

  test('mockPaymentRequest dueDate with format of "ddd MMMM DD YYYY HH:mm:ss" should return "1 June 2022"', async () => {
    mockPaymentRequest.dueDate = 'Wed Jun 01 2022 00:00:00 GMT+0000 (Greenwich Mean Time)'
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].dueDate).toBe('1 June 2022')
  })

  /// 6 January

  test('mockPaymentRequest dueDate with format of "DD/MM/YYYY" should return "6 January 2022"', async () => {
    mockPaymentRequest.dueDate = '06/01/2022'
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].dueDate).toBe('6 January 2022')
  })

  test('mockPaymentRequest dueDate with format of "DD-MM-YYYY" should return "6 January 2022"', async () => {
    mockPaymentRequest.dueDate = '06-01-2022'
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].dueDate).toBe('6 January 2022')
  })

  test('mockPaymentRequest dueDate with format of "D/MM/YYYY" should return "6 January 2022"', async () => {
    mockPaymentRequest.dueDate = '6/1/2022'
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].dueDate).toBe('6 January 2022')
  })

  test('mockPaymentRequest dueDate with format of "D/MM/YY" should return "6 January 2022"', async () => {
    mockPaymentRequest.dueDate = '6/01/22'
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].dueDate).toBe('6 January 2022')
  })

  test('mockPaymentRequest dueDate with format of "ddd MMMM DD YYYY HH:mm:ss" should return "1 June 2022"', async () => {
    mockPaymentRequest.dueDate = 'Thu Jan 06 2022 00:00:00 GMT+0000 (Greenwich Mean Time)'
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].dueDate).toBe('6 January 2022')
  })
})
