const { NAMES } = require('../../../../app/constants/schedules')

jest.mock('../../../../app/processing/settlement/get-settlement')
const getSettlement = require('../../../../app/processing/settlement/get-settlement')

jest.mock('../../../../app/processing/payment-request/get-latest-in-progress-payment-request')
const getLatestInProgressPaymentRequest = require('../../../../app/processing/payment-request/get-latest-in-progress-payment-request')

jest.mock('../../../../app/processing/calculation/get-calculation')
const getCalculation = require('../../../../app/processing/calculation/get-calculation')

jest.mock('../../../../app/processing/components')
const {
  getAddress,
  getDetailedFunding,
  getDetails,
  getDetailedPayments,
  getScheme
} = require('../../../../app/processing/components')

jest.mock('../../../../app/processing/settlement/get-last-settlement')
const getLastSettlement = require('../../../../app/processing/settlement/get-last-settlement')

jest.mock('../../../../app/processing/settlement/get-supporting-settlements')
const getSupportingSettlements = require('../../../../app/processing/settlement/get-supporting-settlements')

jest.mock('../../../../app/processing/payment/get-latest-payment')
const getLatestPayment = require('../../../../app/processing/payment/get-latest-payment')

const { getStatement } = require('../../../../app/processing/statement')

describe('get various components and transform to statement object', () => {
  beforeEach(() => {
    const settlement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-settlement')))
    const paymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').processingPaymentRequest))
    const calculation = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-calculation')))
    const organisation = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-organisation')))
    const detailedFunding = {}
    const lastSettlement = {}
    const latestPayment = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-latest-payment')))

    const mappedSettlement = {
      paymentRequestId: 1,
      invoiceNumber: settlement.invoiceNumber,
      reference: settlement.reference,
      settled: settlement.settled,
      settlementDate: new Date(settlement.settlementDate),
      value: settlement.value
    }

    const mappedPaymentRequest = {
      paymentRequestId: 1,
      agreementNumber: paymentRequest.agreementNumber,
      dueDate: paymentRequest.dueDate,
      frequency: NAMES[paymentRequest.schedule],
      invoiceNumber: paymentRequest.invoiceNumber,
      schedule: paymentRequest.schedule,
      value: paymentRequest.value,
      year: paymentRequest.year
    }

    const mappedCalculation = {
      calculationId: 1,
      paymentRequestId: 1,
      calculated: calculation.calculationDate,
      invoiceNumber: calculation.invoiceNumber,
      sbi: calculation.sbi
    }

    const details = {
      businessName: organisation.businessName,
      email: organisation.email,
      frn: Number(organisation.frn),
      sbi: Number(organisation.sbi)
    }

    const address = {
      line1: organisation.line1,
      line2: organisation.line2,
      line3: organisation.line3,
      line4: organisation.line4,
      line5: organisation.line5,
      postcode: organisation.postcode
    }

    const scheme = {
      name: 'Sustainable Farming Incentive',
      shortName: 'SFI',
      year: String(paymentRequest.year),
      frequency: paymentRequest.frequency,
      agreementNumber: paymentRequest.agreementNumber
    }

    const detailedPayments = [{
      invoiceNumber: latestPayment.invoiceNumber,
      reference: settlement.reference,
      dueDate: latestPayment.dueDate,
      settled: settlement.settlementDate,
      calculated: calculation.calculated,
      value: latestPayment.value,
      period: latestPayment.period
    }]

    getSettlement.mockResolvedValue(mappedSettlement)
    getLatestInProgressPaymentRequest.mockResolvedValue(mappedPaymentRequest)
    getCalculation.mockResolvedValue(mappedCalculation)
    getDetails.mockResolvedValue(details)
    getAddress.mockResolvedValue(address)
    getDetailedFunding.mockResolvedValue(detailedFunding)
    getScheme.mockResolvedValue(scheme)
    getLastSettlement.mockResolvedValue(lastSettlement)
    getSupportingSettlements.mockResolvedValue([])
    getLatestPayment.mockReturnValue(latestPayment)
    getDetailedPayments.mockResolvedValue(detailedPayments)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getCalculation when a settlementId is given', async () => {
    const settlementId = 1
    await getStatement(settlementId)
    expect(getCalculation).toHaveBeenCalled()
  })

  test('should call getLatestPayment when a settlementId is given', async () => {
    const settlementId = 1
    await getStatement(settlementId)
    expect(getLatestPayment).toHaveBeenCalledTimes(1)
  })

  test('should call getSupportingSettlements once when a settlementId is given', async () => {
    const settlementId = 1
    await getStatement(settlementId)
    expect(getSupportingSettlements).toHaveBeenCalledTimes(1)
  })

  test('should call getSettlement when a settlementId is given', async () => {
    const settlementId = 1
    await getStatement(settlementId)
    expect(getSettlement).toHaveBeenCalled()
  })

  test('should call getPaymentRequest when a settlementId is given', async () => {
    const settlementId = 1
    await getStatement(settlementId)
    expect(getLatestInProgressPaymentRequest).toHaveBeenCalled()
  })

  test('should call getDetails when a settlementId is given', async () => {
    const settlementId = 1
    await getStatement(settlementId)
    expect(getDetails).toHaveBeenCalled()
  })

  test('should call getAddress when a settlementId is given', async () => {
    const settlementId = 1
    await getStatement(settlementId)
    expect(getAddress).toHaveBeenCalled()
  })

  test('should call getDetailedFunding when a settlementId is given', async () => {
    const settlementId = 1
    await getStatement(settlementId)
    expect(getDetailedFunding).toHaveBeenCalled()
  })

  test('should call getScheme when a settlementId is given', async () => {
    const settlementId = 1
    await getStatement(settlementId)
    expect(getScheme).toHaveBeenCalled()
  })

  test('should call getDetailedPayments when a settlementId is given', async () => {
    const settlementId = 1
    await getStatement(settlementId)
    expect(getDetailedPayments).toHaveBeenCalled()
  })
})
