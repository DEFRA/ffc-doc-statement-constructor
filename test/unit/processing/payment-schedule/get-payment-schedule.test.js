const mockCommit = jest.fn()
const mockRollback = jest.fn()
const mockTransaction = {
  commit: mockCommit,
  rollback: mockRollback
}

jest.mock('../../../../app/data')
const mockData = require('../../../../app/data')
mockData.sequelize.transaction.mockImplementation(() => {
  return { ...mockTransaction }
})

jest.mock('../../../../app/processing/calculation/get-calculation')
const getCalculation = require('../../../../app/processing/calculation/get-calculation')

jest.mock('../../../../app/processing/payment-request')
const {
  getInProgressPaymentRequest,
  getPreviousPaymentRequests,
  getPreviousPaymentRequestsWithPaymentSchedules,
  getCompletedPaymentRequestByPaymentRequestId,
  mapPaymentRequest
} = require('../../../../app/processing/payment-request')

jest.mock('../../../../app/processing/settlement')
const { getScheduleSupportingSettlements } = require('../../../../app/processing/settlement')

jest.mock('../../../../app/processing/components')
const {
  getAddress,
  getDetails,
  getScheme,
  getScheduleDates,
  getAdjustment,
  getRemainingAmount
} = require('../../../../app/processing/components')

const { getPaymentSchedule } = require('../../../../app/processing/payment-schedule')
const { NAMES } = require('../../../../app/constants/schedules')

jest.mock('../../../../app/processing/payment')
const { calculateScheduledPayments } = require('../../../../app/processing/payment')

let paymentRequest
let calculation
let organisation
let mappedPaymentRequest
let settlement
let previousPaymentSchedule

describe('get various components and transform to payment schedule object', () => {
  beforeEach(() => {
    paymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').processingPaymentRequest))
    calculation = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-calculation')))
    organisation = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-organisation')))
    settlement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-settlement')))
    previousPaymentSchedule = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-timelines')))

    mappedPaymentRequest = {
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

    const schedule = [{
      order: 1,
      dueDate: '01/01/2022',
      period: 'Sep-Dec 2021',
      value: '100.00'
    }]

    const adjustment = {
      currentValue: '100.00',
      newValue: '100.00',
      adjustmentValue: '0.00'
    }

    const remainingAmount = 500

    getCompletedPaymentRequestByPaymentRequestId.mockResolvedValue(paymentRequest)
    getInProgressPaymentRequest.mockResolvedValue(paymentRequest)
    getPreviousPaymentRequests.mockResolvedValue([paymentRequest])
    getPreviousPaymentRequestsWithPaymentSchedules.mockResolvedValue([paymentRequest])
    mapPaymentRequest.mockReturnValue(mappedPaymentRequest)
    getScheduleSupportingSettlements.mockResolvedValue([settlement])
    getCalculation.mockResolvedValue(mappedCalculation)
    getDetails.mockResolvedValue(details)
    getAddress.mockResolvedValue(address)
    getScheme.mockResolvedValue(scheme)
    getScheduleDates.mockResolvedValue(schedule)
    getAdjustment.mockResolvedValue(adjustment)
    getRemainingAmount.mockResolvedValue(remainingAmount)
    calculateScheduledPayments.mockResolvedValue(previousPaymentSchedule)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getCompletedPaymentRequestByPaymentRequestId when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getPaymentSchedule(paymentRequestId)
    expect(getCompletedPaymentRequestByPaymentRequestId).toHaveBeenCalled()
  })

  test('should call getCompletedPaymentRequestByPaymentRequestId with paymentRequestId and transaction', async () => {
    const paymentRequestId = 1
    await getPaymentSchedule(paymentRequestId)
    expect(getCompletedPaymentRequestByPaymentRequestId).toHaveBeenCalledWith(paymentRequestId, mockTransaction)
  })

  test('should call getInProgressPaymentRequest when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getPaymentSchedule(paymentRequestId)
    expect(getInProgressPaymentRequest).toHaveBeenCalled()
  })

  test('should call getInProgressPaymentRequest with correlationId and transaction', async () => {
    const paymentRequestId = 1
    await getPaymentSchedule(paymentRequestId)
    expect(getInProgressPaymentRequest).toHaveBeenCalledWith(paymentRequest.correlationId, mockTransaction)
  })

  test('should call mapPaymentRequest when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getPaymentSchedule(paymentRequestId)
    expect(mapPaymentRequest).toHaveBeenCalled()
  })

  test('should call mapPaymentRequest with paymentRequest', async () => {
    const paymentRequestId = 1
    await getPaymentSchedule(paymentRequestId)
    expect(mapPaymentRequest).toHaveBeenCalledWith(paymentRequest)
  })

  test('should call getPreviousPaymentRequests when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getPaymentSchedule(paymentRequestId)
    expect(getPreviousPaymentRequests).toHaveBeenCalled()
  })

  test('should call getPreviousPaymentRequests with agreementNumber, year, paymentRequestNumber and transaction', async () => {
    const paymentRequestId = 1
    await getPaymentSchedule(paymentRequestId)
    expect(getPreviousPaymentRequests).toHaveBeenCalledWith(mappedPaymentRequest.agreementNumber, mappedPaymentRequest.year, mappedPaymentRequest.paymentRequestNumber, mockTransaction)
  })

  test('should call getAdjustment when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getPaymentSchedule(paymentRequestId)
    expect(getAdjustment).toHaveBeenCalled()
  })

  test('should call getCalculation when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getPaymentSchedule(paymentRequestId)
    expect(getCalculation).toHaveBeenCalled()
  })

  test('should call getDetails when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getPaymentSchedule(paymentRequestId)
    expect(getDetails).toHaveBeenCalled()
  })

  test('should call getAddress when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getPaymentSchedule(paymentRequestId)
    expect(getAddress).toHaveBeenCalled()
  })

  test('should call getScheme when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getPaymentSchedule(paymentRequestId)
    expect(getScheme).toHaveBeenCalled()
  })

  test('should call getSchedule when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getPaymentSchedule(paymentRequestId)
    expect(getScheduleDates).toHaveBeenCalled()
  })

  test('should call getRemainingAmount when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getPaymentSchedule(paymentRequestId)
    expect(getRemainingAmount).toHaveBeenCalled()
  })

  test('should call getRemainingAmount with calculateScheduledPayments and mappedPaymentRequest.value when a paymentRequestId is given', async () => {
    const paymentRequestId = 1
    await getPaymentSchedule(paymentRequestId)
    expect(getRemainingAmount).toHaveBeenCalledWith(calculateScheduledPayments(), mappedPaymentRequest.value)
  })
})
