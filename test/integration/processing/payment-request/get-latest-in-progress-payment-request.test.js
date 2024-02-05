const moment = require('moment')

const db = require('../../../../app/data')

const { NAMES: SCHEDULE_NAMES } = require('../../../../app/constants/schedules')

const { getLatestInProgressPaymentRequest } = require('../../../../app/processing/payment-request')
const { TWO_THOUSAND_POUNDS, ONE_THOUSAND_POUNDS, MINUS_NINE_HUNDRED_POUNDS, NINE_HUNDRED_POUNDS, MINUS_FOUR_HUNDRED_AND_FIFTY_POUNDS } = require('../../../mock-components/mock-value')
const { CORRELATION_ID_SECOND_POST_PAYMENT_ADJUSTMENT } = require('../../../mock-components/mock-uuidv4')
const { COMPLETED } = require('../../../../app/constants/statuses')
const { DATE: SETTLEMENT_DATE } = require('../../../mock-components/mock-dates').SETTLEMENT

const PAYMENT_REQUEST_ID_IN_PROGRESS = 1
const PAYMENT_REQUEST_ID_COMPLETED = 2

let invoiceNumbers

let paymentRequestInProgress
let paymentRequestCompleted
let topUpInProgressPaymentRequest
let topUpCompletedPaymentRequest
let downwardAdjustmentInProgressPaymentRequest
let downwardAdjustmentCompletedPaymentRequest
let recoveryInProgressPaymentRequest
let recoveryCompletedPaymentRequest
let splitInProgressPaymentRequest
let splitACompletedPaymentRequest
let splitBCompletedPaymentRequest

let settlement

describe('get latest in progress payment request', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    const schemes = JSON.parse(JSON.stringify(require('../../../../app/constants/schemes')))
    invoiceNumbers = JSON.parse(JSON.stringify(require('../../../mock-components/mock-invoice-number')))
    paymentRequestInProgress = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').processingPaymentRequest))
    paymentRequestCompleted = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').submitPaymentRequest))
    topUpInProgressPaymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').topUpProcessingPaymentRequest))
    topUpCompletedPaymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').topUpSubmitPaymentRequest))
    downwardAdjustmentInProgressPaymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').downwardAdjustmentProcessingPaymentRequest))
    downwardAdjustmentCompletedPaymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').downwardAdjustmentSubmitPaymentRequest))
    recoveryInProgressPaymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').recoveryProcessingPaymentRequest))
    recoveryCompletedPaymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').recoverySubmitPaymentRequest))
    splitInProgressPaymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').splitProcessingPaymentRequest))
    splitACompletedPaymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').splitSubmitPaymentRequestA))
    splitBCompletedPaymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').splitSubmitPaymentRequestB))
    settlement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-settlement')))
    settlement.settlementDate = SETTLEMENT_DATE

    await db.scheme.bulkCreate(schemes)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_FIRST_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_FIRST_PAYMENT_ORIGINAL })
    delete paymentRequestInProgress.paymentRequestId
    delete paymentRequestCompleted.paymentRequestId
  })

  afterEach(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  afterAll(async () => {
    await db.sequelize.close()
  })

  test('should return mapped payment request object when existing completed payment request with required information exists', async () => {
    await db.paymentRequest.create(paymentRequestInProgress)
    await db.paymentRequest.create(paymentRequestCompleted)
    await db.settlement.create(settlement)

    const result = await getLatestInProgressPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED, SETTLEMENT_DATE)

    expect(result).toStrictEqual({
      paymentRequestId: PAYMENT_REQUEST_ID_IN_PROGRESS,
      agreementNumber: paymentRequestInProgress.agreementNumber,
      dueDate: new Date(moment(paymentRequestInProgress.dueDate, 'DD/MM/YYYY')),
      frequency: SCHEDULE_NAMES.Q4,
      invoiceNumber: paymentRequestInProgress.invoiceNumber,
      value: paymentRequestInProgress.value,
      year: paymentRequestInProgress.marketingYear,
      schedule: paymentRequestInProgress.schedule,
      sourceSystem: paymentRequestInProgress.sourceSystem,
      originalValue: paymentRequestInProgress.value,
      paymentRequestNumber: paymentRequestInProgress.paymentRequestNumber
    })
  })

  test('should return mapped payment request object with default frequency when existing completed payment request with required information exists and no optional schedule', async () => {
    delete paymentRequestInProgress.schedule
    await db.paymentRequest.create(paymentRequestInProgress)
    await db.paymentRequest.create(paymentRequestCompleted)
    await db.settlement.create(settlement)

    const result = await getLatestInProgressPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED, SETTLEMENT_DATE)

    expect(result).toStrictEqual({
      agreementNumber: paymentRequestInProgress.agreementNumber,
      paymentRequestId: PAYMENT_REQUEST_ID_IN_PROGRESS,
      dueDate: new Date(moment(paymentRequestInProgress.dueDate, 'DD/MM/YYYY')),
      frequency: SCHEDULE_NAMES.N0,
      invoiceNumber: paymentRequestInProgress.invoiceNumber,
      value: paymentRequestInProgress.value,
      year: paymentRequestInProgress.marketingYear,
      schedule: null,
      sourceSystem: paymentRequestInProgress.sourceSystem,
      originalValue: paymentRequestInProgress.value,
      paymentRequestNumber: paymentRequestInProgress.paymentRequestNumber
    })
  })

  test('should return mapped payment request object with default frequency when existing completed payment request with required information exists and undefined optional schedule', async () => {
    paymentRequestInProgress.schedule = undefined
    await db.paymentRequest.create(paymentRequestInProgress)
    await db.paymentRequest.create(paymentRequestCompleted)
    await db.settlement.create(settlement)

    const result = await getLatestInProgressPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED, SETTLEMENT_DATE)

    expect(result).toStrictEqual({
      agreementNumber: paymentRequestInProgress.agreementNumber,
      paymentRequestId: PAYMENT_REQUEST_ID_IN_PROGRESS,
      dueDate: new Date(moment(paymentRequestInProgress.dueDate, 'DD/MM/YYYY')),
      frequency: SCHEDULE_NAMES.N0,
      invoiceNumber: paymentRequestInProgress.invoiceNumber,
      value: paymentRequestInProgress.value,
      year: paymentRequestInProgress.marketingYear,
      schedule: null,
      sourceSystem: paymentRequestInProgress.sourceSystem,
      originalValue: paymentRequestInProgress.value,
      paymentRequestNumber: paymentRequestInProgress.paymentRequestNumber
    })
  })

  test('should return mapped payment request object with default frequency when existing completed payment request with required information exists and null optional schedule', async () => {
    paymentRequestInProgress.schedule = null
    await db.paymentRequest.create(paymentRequestInProgress)
    await db.paymentRequest.create(paymentRequestCompleted)
    await db.settlement.create(settlement)

    const result = await getLatestInProgressPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED, SETTLEMENT_DATE)

    expect(result).toStrictEqual({
      agreementNumber: paymentRequestInProgress.agreementNumber,
      paymentRequestId: PAYMENT_REQUEST_ID_IN_PROGRESS,
      dueDate: new Date(moment(paymentRequestInProgress.dueDate, 'DD/MM/YYYY')),
      frequency: SCHEDULE_NAMES.N0,
      invoiceNumber: paymentRequestInProgress.invoiceNumber,
      value: paymentRequestInProgress.value,
      year: paymentRequestInProgress.marketingYear,
      schedule: paymentRequestInProgress.schedule,
      sourceSystem: paymentRequestInProgress.sourceSystem,
      originalValue: paymentRequestInProgress.value,
      paymentRequestNumber: paymentRequestInProgress.paymentRequestNumber
    })
  })

  test('should return mapped payment request object with default frequency when existing completed payment request with required information exists and unrecognised optional schedule', async () => {
    paymentRequestInProgress.schedule = 'NR'
    await db.paymentRequest.create(paymentRequestInProgress)
    await db.paymentRequest.create(paymentRequestCompleted)
    await db.settlement.create(settlement)

    const result = await getLatestInProgressPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED, SETTLEMENT_DATE)

    expect(result).toStrictEqual({
      agreementNumber: paymentRequestInProgress.agreementNumber,
      paymentRequestId: PAYMENT_REQUEST_ID_IN_PROGRESS,
      dueDate: new Date(moment(paymentRequestInProgress.dueDate, 'DD/MM/YYYY')),
      frequency: SCHEDULE_NAMES.N0,
      invoiceNumber: paymentRequestInProgress.invoiceNumber,
      value: paymentRequestInProgress.value,
      year: paymentRequestInProgress.marketingYear,
      schedule: paymentRequestInProgress.schedule,
      sourceSystem: paymentRequestInProgress.sourceSystem,
      originalValue: paymentRequestInProgress.value,
      paymentRequestNumber: paymentRequestInProgress.paymentRequestNumber
    })
  })

  test('should throw when no existing payment requests exists', async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })

    const wrapper = async () => { await getLatestInProgressPaymentRequest(1, SETTLEMENT_DATE) }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw when no existing payment requests exists', async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })

    const wrapper = async () => { await getLatestInProgressPaymentRequest(undefined, SETTLEMENT_DATE) }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw when no existing payment requests exists', async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })

    const wrapper = async () => { await getLatestInProgressPaymentRequest(null, SETTLEMENT_DATE) }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw when existing in progress payment request with required information exists', async () => {
    await db.paymentRequest.create(paymentRequestInProgress)
    const wrapper = async () => { await getLatestInProgressPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED, SETTLEMENT_DATE) }
    expect(wrapper).rejects.toThrow()
  })

  test('should throw when existing completed payment request with missing required dueDate does not exist', async () => {
    delete paymentRequestInProgress.dueDate
    await db.paymentRequest.create(paymentRequestInProgress)
    await db.paymentRequest.create(paymentRequestCompleted)
    await db.settlement.create(settlement)

    const wrapper = async () => { await getLatestInProgressPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED, SETTLEMENT_DATE) }
    expect(wrapper).rejects.toThrow()
  })

  test('should throw when existing completed payment request with missing required marketingYear does not exist', async () => {
    delete paymentRequestInProgress.marketingYear
    await db.paymentRequest.create(paymentRequestInProgress)
    await db.paymentRequest.create(paymentRequestCompleted)
    await db.settlement.create(settlement)

    const wrapper = async () => { await getLatestInProgressPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED, SETTLEMENT_DATE) }
    expect(wrapper).rejects.toThrow()
  })

  test('should return original in progress payment request if no post payment adjustments', async () => {
    await db.paymentRequest.create(paymentRequestInProgress)
    await db.paymentRequest.create(paymentRequestCompleted)
    await db.settlement.create(settlement)

    const result = await getLatestInProgressPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED, SETTLEMENT_DATE)

    expect(result).toStrictEqual({
      agreementNumber: paymentRequestInProgress.agreementNumber,
      paymentRequestId: PAYMENT_REQUEST_ID_IN_PROGRESS,
      dueDate: new Date(moment(paymentRequestInProgress.dueDate, 'DD/MM/YYYY')),
      frequency: SCHEDULE_NAMES.Q4,
      invoiceNumber: paymentRequestInProgress.invoiceNumber,
      value: paymentRequestInProgress.value,
      year: paymentRequestInProgress.marketingYear,
      schedule: paymentRequestInProgress.schedule,
      sourceSystem: paymentRequestInProgress.sourceSystem,
      originalValue: paymentRequestInProgress.value,
      paymentRequestNumber: paymentRequestInProgress.paymentRequestNumber
    })
  })

  test('should return top up in progress payment request if top up', async () => {
    await db.paymentRequest.create(paymentRequestInProgress)
    await db.paymentRequest.create(paymentRequestCompleted)
    await db.settlement.create(settlement)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(topUpInProgressPaymentRequest)
    await db.paymentRequest.create(topUpCompletedPaymentRequest)
    settlement.invoiceNumber = invoiceNumbers.SFI_SECOND_PAYMENT
    await db.settlement.create(settlement)
    const result = await getLatestInProgressPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED, SETTLEMENT_DATE)

    expect(result).toStrictEqual({
      agreementNumber: topUpInProgressPaymentRequest.agreementNumber,
      paymentRequestId: 3,
      dueDate: new Date(moment(topUpInProgressPaymentRequest.dueDate, 'DD/MM/YYYY')),
      frequency: SCHEDULE_NAMES.Q4,
      invoiceNumber: topUpInProgressPaymentRequest.invoiceNumber,
      value: topUpInProgressPaymentRequest.value,
      year: topUpInProgressPaymentRequest.marketingYear,
      schedule: topUpInProgressPaymentRequest.schedule,
      sourceSystem: paymentRequestInProgress.sourceSystem,
      originalValue: paymentRequestInProgress.value,
      paymentRequestNumber: topUpInProgressPaymentRequest.paymentRequestNumber
    })
  })

  test('should throw when top up in progress missing', async () => {
    await db.paymentRequest.create(paymentRequestInProgress)
    await db.paymentRequest.create(paymentRequestCompleted)
    await db.settlement.create(settlement)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(topUpCompletedPaymentRequest)
    settlement.invoiceNumber = invoiceNumbers.SFI_SECOND_PAYMENT
    await db.settlement.create(settlement)
    const wrapper = async () => { await getLatestInProgressPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED, SETTLEMENT_DATE) }
    expect(wrapper).rejects.toThrow()
  })

  test('should return original in progress payment request if top up not yet submitted', async () => {
    await db.paymentRequest.create(paymentRequestInProgress)
    await db.paymentRequest.create(paymentRequestCompleted)
    await db.settlement.create(settlement)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(topUpInProgressPaymentRequest)
    settlement.invoiceNumber = invoiceNumbers.SFI_SECOND_PAYMENT
    await db.settlement.create(settlement)
    const result = await getLatestInProgressPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED, SETTLEMENT_DATE)

    expect(result).toStrictEqual({
      agreementNumber: paymentRequestInProgress.agreementNumber,
      paymentRequestId: PAYMENT_REQUEST_ID_IN_PROGRESS,
      dueDate: new Date(moment(paymentRequestInProgress.dueDate, 'DD/MM/YYYY')),
      frequency: SCHEDULE_NAMES.Q4,
      invoiceNumber: paymentRequestInProgress.invoiceNumber,
      value: paymentRequestInProgress.value,
      year: paymentRequestInProgress.marketingYear,
      schedule: paymentRequestInProgress.schedule,
      sourceSystem: paymentRequestInProgress.sourceSystem,
      originalValue: paymentRequestInProgress.value,
      paymentRequestNumber: paymentRequestInProgress.paymentRequestNumber
    })
  })

  test('should original in progress payment request if top up settlement does not exist', async () => {
    await db.paymentRequest.create(paymentRequestInProgress)
    await db.paymentRequest.create(paymentRequestCompleted)
    await db.settlement.create(settlement)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(topUpInProgressPaymentRequest)
    await db.paymentRequest.create(topUpCompletedPaymentRequest)
    const result = await getLatestInProgressPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED, SETTLEMENT_DATE)

    expect(result).toStrictEqual({
      agreementNumber: paymentRequestInProgress.agreementNumber,
      paymentRequestId: 1,
      dueDate: new Date(moment(paymentRequestInProgress.dueDate, 'DD/MM/YYYY')),
      frequency: SCHEDULE_NAMES.Q4,
      invoiceNumber: paymentRequestInProgress.invoiceNumber,
      value: paymentRequestInProgress.value,
      year: paymentRequestInProgress.marketingYear,
      schedule: paymentRequestInProgress.schedule,
      sourceSystem: paymentRequestInProgress.sourceSystem,
      originalValue: paymentRequestInProgress.value,
      paymentRequestNumber: paymentRequestInProgress.paymentRequestNumber
    })
  })

  test('should return original in progress payment request if top up unsettled', async () => {
    await db.paymentRequest.create(paymentRequestInProgress)
    await db.paymentRequest.create(paymentRequestCompleted)
    await db.settlement.create(settlement)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(topUpInProgressPaymentRequest)
    await db.paymentRequest.create(topUpCompletedPaymentRequest)
    settlement.invoiceNumber = invoiceNumbers.SFI_SECOND_PAYMENT
    settlement.settled = false
    await db.settlement.create(settlement)
    const result = await getLatestInProgressPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED, SETTLEMENT_DATE)

    expect(result).toStrictEqual({
      agreementNumber: paymentRequestInProgress.agreementNumber,
      paymentRequestId: 1,
      dueDate: new Date(moment(paymentRequestInProgress.dueDate, 'DD/MM/YYYY')),
      frequency: SCHEDULE_NAMES.Q4,
      invoiceNumber: paymentRequestInProgress.invoiceNumber,
      value: paymentRequestInProgress.value,
      year: paymentRequestInProgress.marketingYear,
      schedule: paymentRequestInProgress.schedule,
      sourceSystem: paymentRequestInProgress.sourceSystem,
      originalValue: paymentRequestInProgress.value,
      paymentRequestNumber: paymentRequestInProgress.paymentRequestNumber
    })
  })

  test('should return downward adjustment in progress payment request if downward adjustment', async () => {
    await db.paymentRequest.create(paymentRequestInProgress)
    await db.paymentRequest.create(paymentRequestCompleted)
    await db.settlement.create(settlement)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(downwardAdjustmentInProgressPaymentRequest)
    await db.paymentRequest.create(downwardAdjustmentCompletedPaymentRequest)
    settlement.invoiceNumber = invoiceNumbers.SFI_SECOND_PAYMENT
    await db.settlement.create(settlement)
    const result = await getLatestInProgressPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED, SETTLEMENT_DATE)

    expect(result).toStrictEqual({
      agreementNumber: downwardAdjustmentInProgressPaymentRequest.agreementNumber,
      paymentRequestId: 3,
      dueDate: new Date(moment(downwardAdjustmentInProgressPaymentRequest.dueDate, 'DD/MM/YYYY')),
      frequency: SCHEDULE_NAMES.Q4,
      invoiceNumber: downwardAdjustmentInProgressPaymentRequest.invoiceNumber,
      value: downwardAdjustmentInProgressPaymentRequest.value,
      year: downwardAdjustmentInProgressPaymentRequest.marketingYear,
      schedule: downwardAdjustmentInProgressPaymentRequest.schedule,
      sourceSystem: paymentRequestInProgress.sourceSystem,
      originalValue: paymentRequestInProgress.value,
      paymentRequestNumber: downwardAdjustmentInProgressPaymentRequest.paymentRequestNumber
    })
  })

  test('should throw when downward adjustment in progress missing', async () => {
    await db.paymentRequest.create(paymentRequestInProgress)
    await db.paymentRequest.create(paymentRequestCompleted)
    await db.settlement.create(settlement)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(downwardAdjustmentCompletedPaymentRequest)
    settlement.invoiceNumber = invoiceNumbers.SFI_SECOND_PAYMENT
    await db.settlement.create(settlement)
    const wrapper = async () => { await getLatestInProgressPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED, SETTLEMENT_DATE) }
    expect(wrapper).rejects.toThrow()
  })

  test('should return original in progress payment request if downward adjustment not yet submitted', async () => {
    await db.paymentRequest.create(paymentRequestInProgress)
    await db.paymentRequest.create(paymentRequestCompleted)
    await db.settlement.create(settlement)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(downwardAdjustmentInProgressPaymentRequest)

    const result = await getLatestInProgressPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED, SETTLEMENT_DATE)

    expect(result).toStrictEqual({
      agreementNumber: paymentRequestInProgress.agreementNumber,
      paymentRequestId: PAYMENT_REQUEST_ID_IN_PROGRESS,
      dueDate: new Date(moment(paymentRequestInProgress.dueDate, 'DD/MM/YYYY')),
      frequency: SCHEDULE_NAMES.Q4,
      invoiceNumber: paymentRequestInProgress.invoiceNumber,
      value: paymentRequestInProgress.value,
      year: paymentRequestInProgress.marketingYear,
      schedule: paymentRequestInProgress.schedule,
      sourceSystem: paymentRequestInProgress.sourceSystem,
      originalValue: paymentRequestInProgress.value,
      paymentRequestNumber: paymentRequestInProgress.paymentRequestNumber
    })
  })

  test('should return original in progress payment request if downward adjustment settlement does not exist', async () => {
    await db.paymentRequest.create(paymentRequestInProgress)
    await db.paymentRequest.create(paymentRequestCompleted)
    await db.settlement.create(settlement)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(downwardAdjustmentInProgressPaymentRequest)
    await db.paymentRequest.create(downwardAdjustmentCompletedPaymentRequest)

    const result = await getLatestInProgressPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED, SETTLEMENT_DATE)

    expect(result).toStrictEqual({
      agreementNumber: paymentRequestInProgress.agreementNumber,
      paymentRequestId: 1,
      dueDate: new Date(moment(paymentRequestInProgress.dueDate, 'DD/MM/YYYY')),
      frequency: SCHEDULE_NAMES.Q4,
      invoiceNumber: paymentRequestInProgress.invoiceNumber,
      value: paymentRequestInProgress.value,
      year: paymentRequestInProgress.marketingYear,
      schedule: paymentRequestInProgress.schedule,
      sourceSystem: paymentRequestInProgress.sourceSystem,
      originalValue: paymentRequestInProgress.value,
      paymentRequestNumber: paymentRequestInProgress.paymentRequestNumber
    })
  })

  test('should return original in progress payment request if downward adjustment unsettled', async () => {
    await db.paymentRequest.create(paymentRequestInProgress)
    await db.paymentRequest.create(paymentRequestCompleted)
    await db.settlement.create(settlement)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(downwardAdjustmentInProgressPaymentRequest)
    await db.paymentRequest.create(downwardAdjustmentCompletedPaymentRequest)
    settlement.invoiceNumber = invoiceNumbers.SFI_SECOND_PAYMENT
    settlement.settled = false
    await db.settlement.create(settlement)

    const result = await getLatestInProgressPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED, SETTLEMENT_DATE)

    expect(result).toStrictEqual({
      agreementNumber: paymentRequestInProgress.agreementNumber,
      paymentRequestId: 1,
      dueDate: new Date(moment(paymentRequestInProgress.dueDate, 'DD/MM/YYYY')),
      frequency: SCHEDULE_NAMES.Q4,
      invoiceNumber: paymentRequestInProgress.invoiceNumber,
      value: paymentRequestInProgress.value,
      year: paymentRequestInProgress.marketingYear,
      schedule: paymentRequestInProgress.schedule,
      sourceSystem: paymentRequestInProgress.sourceSystem,
      originalValue: paymentRequestInProgress.value,
      paymentRequestNumber: paymentRequestInProgress.paymentRequestNumber
    })
  })

  test('should return recovery in progress payment request if recovery', async () => {
    await db.paymentRequest.create(paymentRequestInProgress)
    await db.paymentRequest.create(paymentRequestCompleted)
    await db.settlement.create(settlement)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(recoveryInProgressPaymentRequest)
    await db.paymentRequest.create(recoveryCompletedPaymentRequest)
    settlement.invoiceNumber = invoiceNumbers.SFI_SECOND_PAYMENT
    await db.settlement.create(settlement)
    const result = await getLatestInProgressPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED, SETTLEMENT_DATE)

    expect(result).toStrictEqual({
      agreementNumber: recoveryInProgressPaymentRequest.agreementNumber,
      paymentRequestId: 3,
      dueDate: new Date(moment(recoveryInProgressPaymentRequest.dueDate, 'DD/MM/YYYY')),
      frequency: SCHEDULE_NAMES.Q4,
      invoiceNumber: recoveryInProgressPaymentRequest.invoiceNumber,
      value: recoveryInProgressPaymentRequest.value,
      year: recoveryInProgressPaymentRequest.marketingYear,
      schedule: recoveryInProgressPaymentRequest.schedule,
      sourceSystem: paymentRequestInProgress.sourceSystem,
      originalValue: paymentRequestInProgress.value,
      paymentRequestNumber: recoveryInProgressPaymentRequest.paymentRequestNumber
    })
  })

  test('should throw when recovery in progress missing', async () => {
    await db.paymentRequest.create(paymentRequestInProgress)
    await db.paymentRequest.create(paymentRequestCompleted)
    await db.settlement.create(settlement)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(recoveryCompletedPaymentRequest)
    settlement.invoiceNumber = invoiceNumbers.SFI_SECOND_PAYMENT
    await db.settlement.create(settlement)

    const wrapper = async () => { await getLatestInProgressPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED, SETTLEMENT_DATE) }
    expect(wrapper).rejects.toThrow()
  })

  test('should return original in progress payment request if recovery not yet submitted', async () => {
    await db.paymentRequest.create(paymentRequestInProgress)
    await db.paymentRequest.create(paymentRequestCompleted)
    await db.settlement.create(settlement)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(recoveryInProgressPaymentRequest)

    const result = await getLatestInProgressPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED, SETTLEMENT_DATE)

    expect(result).toStrictEqual({
      agreementNumber: paymentRequestInProgress.agreementNumber,
      paymentRequestId: PAYMENT_REQUEST_ID_IN_PROGRESS,
      dueDate: new Date(moment(paymentRequestInProgress.dueDate, 'DD/MM/YYYY')),
      frequency: SCHEDULE_NAMES.Q4,
      invoiceNumber: paymentRequestInProgress.invoiceNumber,
      value: paymentRequestInProgress.value,
      year: paymentRequestInProgress.marketingYear,
      schedule: paymentRequestInProgress.schedule,
      sourceSystem: paymentRequestInProgress.sourceSystem,
      originalValue: paymentRequestInProgress.value,
      paymentRequestNumber: paymentRequestInProgress.paymentRequestNumber
    })
  })

  test('should return split in progress payment request if split invoice', async () => {
    await db.paymentRequest.create(paymentRequestInProgress)
    await db.paymentRequest.create(paymentRequestCompleted)
    await db.settlement.create(settlement)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SPLIT_A, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SPLIT_B, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(splitInProgressPaymentRequest)
    await db.paymentRequest.create(splitACompletedPaymentRequest)
    await db.paymentRequest.create(splitBCompletedPaymentRequest)
    settlement.invoiceNumber = invoiceNumbers.SFI_SPLIT_A
    await db.settlement.create(settlement)
    settlement.invoiceNumber = invoiceNumbers.SFI_SPLIT_B
    await db.settlement.create(settlement)
    const result = await getLatestInProgressPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED, SETTLEMENT_DATE)

    expect(result).toStrictEqual({
      agreementNumber: splitInProgressPaymentRequest.agreementNumber,
      paymentRequestId: 3,
      dueDate: new Date(moment(splitInProgressPaymentRequest.dueDate, 'DD/MM/YYYY')),
      frequency: SCHEDULE_NAMES.Q4,
      invoiceNumber: splitInProgressPaymentRequest.invoiceNumber,
      value: splitInProgressPaymentRequest.value,
      year: splitInProgressPaymentRequest.marketingYear,
      schedule: splitInProgressPaymentRequest.schedule,
      sourceSystem: paymentRequestInProgress.sourceSystem,
      originalValue: paymentRequestInProgress.value,
      paymentRequestNumber: splitInProgressPaymentRequest.paymentRequestNumber
    })
  })

  test('should throw when split in progress missing', async () => {
    await db.paymentRequest.create(paymentRequestInProgress)
    await db.paymentRequest.create(paymentRequestCompleted)
    await db.settlement.create(settlement)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SPLIT_A, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SPLIT_B, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(splitACompletedPaymentRequest)
    await db.paymentRequest.create(splitBCompletedPaymentRequest)
    settlement.invoiceNumber = invoiceNumbers.SFI_SPLIT_A
    await db.settlement.create(settlement)
    settlement.invoiceNumber = invoiceNumbers.SFI_SPLIT_B
    await db.settlement.create(settlement)

    const wrapper = async () => { await getLatestInProgressPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED, SETTLEMENT_DATE) }
    expect(wrapper).rejects.toThrow()
  })

  test('should return original in progress payment request if split not yet submitted', async () => {
    await db.paymentRequest.create(paymentRequestInProgress)
    await db.paymentRequest.create(paymentRequestCompleted)
    await db.settlement.create(settlement)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SPLIT_A, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SPLIT_B, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(splitInProgressPaymentRequest)

    const result = await getLatestInProgressPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED, SETTLEMENT_DATE)

    expect(result).toStrictEqual({
      agreementNumber: paymentRequestInProgress.agreementNumber,
      paymentRequestId: PAYMENT_REQUEST_ID_IN_PROGRESS,
      dueDate: new Date(moment(paymentRequestInProgress.dueDate, 'DD/MM/YYYY')),
      frequency: SCHEDULE_NAMES.Q4,
      invoiceNumber: paymentRequestInProgress.invoiceNumber,
      value: paymentRequestInProgress.value,
      year: paymentRequestInProgress.marketingYear,
      schedule: paymentRequestInProgress.schedule,
      sourceSystem: paymentRequestInProgress.sourceSystem,
      originalValue: paymentRequestInProgress.value,
      paymentRequestNumber: paymentRequestInProgress.paymentRequestNumber
    })
  })

  test('should return latest top up in progress payment request if multiple top ups', async () => {
    await db.paymentRequest.create(paymentRequestInProgress)
    await db.paymentRequest.create(paymentRequestCompleted)
    await db.settlement.create(settlement)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(topUpInProgressPaymentRequest)
    await db.paymentRequest.create(topUpCompletedPaymentRequest)
    settlement.invoiceNumbers = invoiceNumbers.SFI_SECOND_PAYMENT
    await db.settlement.create(settlement)

    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_THIRD_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_THIRD_PAYMENT_ORIGINAL })

    const secondTopUpInProgressPaymentRequest = JSON.parse(JSON.stringify(topUpInProgressPaymentRequest))
    secondTopUpInProgressPaymentRequest.invoiceNumber = invoiceNumbers.SFI_THIRD_PAYMENT
    secondTopUpInProgressPaymentRequest.paymentRequestNumber = 3
    secondTopUpInProgressPaymentRequest.correlationId = CORRELATION_ID_SECOND_POST_PAYMENT_ADJUSTMENT
    secondTopUpInProgressPaymentRequest.value = TWO_THOUSAND_POUNDS
    await db.paymentRequest.create(secondTopUpInProgressPaymentRequest)

    const secondTopUpCompletedPaymentRequest = JSON.parse(JSON.stringify(secondTopUpInProgressPaymentRequest))
    secondTopUpCompletedPaymentRequest.value = ONE_THOUSAND_POUNDS
    secondTopUpCompletedPaymentRequest.status = COMPLETED
    await db.paymentRequest.create(secondTopUpCompletedPaymentRequest)

    settlement.invoiceNumber = invoiceNumbers.SFI_THIRD_PAYMENT
    await db.settlement.create(settlement)

    const result = await getLatestInProgressPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED, SETTLEMENT_DATE)

    expect(result).toStrictEqual({
      agreementNumber: secondTopUpInProgressPaymentRequest.agreementNumber,
      paymentRequestId: 5,
      dueDate: new Date(moment(secondTopUpInProgressPaymentRequest.dueDate, 'DD/MM/YYYY')),
      frequency: SCHEDULE_NAMES.Q4,
      invoiceNumber: secondTopUpInProgressPaymentRequest.invoiceNumber,
      value: secondTopUpInProgressPaymentRequest.value,
      year: secondTopUpInProgressPaymentRequest.marketingYear,
      schedule: secondTopUpInProgressPaymentRequest.schedule,
      sourceSystem: paymentRequestInProgress.sourceSystem,
      originalValue: paymentRequestInProgress.value,
      paymentRequestNumber: secondTopUpInProgressPaymentRequest.paymentRequestNumber
    })
  })

  test('should return previous top up in progress payment request if latest not submitted', async () => {
    await db.paymentRequest.create(paymentRequestInProgress)
    await db.paymentRequest.create(paymentRequestCompleted)
    await db.settlement.create(settlement)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(topUpInProgressPaymentRequest)
    await db.paymentRequest.create(topUpCompletedPaymentRequest)
    settlement.invoiceNumber = invoiceNumbers.SFI_SECOND_PAYMENT
    await db.settlement.create(settlement)

    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_THIRD_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_THIRD_PAYMENT_ORIGINAL })

    const secondTopUpInProgressPaymentRequest = JSON.parse(JSON.stringify(topUpInProgressPaymentRequest))
    secondTopUpInProgressPaymentRequest.invoiceNumber = invoiceNumbers.SFI_THIRD_PAYMENT
    secondTopUpInProgressPaymentRequest.paymentRequestNumber = 3
    secondTopUpInProgressPaymentRequest.correlationId = CORRELATION_ID_SECOND_POST_PAYMENT_ADJUSTMENT
    secondTopUpInProgressPaymentRequest.value = TWO_THOUSAND_POUNDS
    await db.paymentRequest.create(secondTopUpInProgressPaymentRequest)

    const result = await getLatestInProgressPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED, SETTLEMENT_DATE)

    expect(result).toStrictEqual({
      agreementNumber: topUpInProgressPaymentRequest.agreementNumber,
      paymentRequestId: 3,
      dueDate: new Date(moment(topUpInProgressPaymentRequest.dueDate, 'DD/MM/YYYY')),
      frequency: SCHEDULE_NAMES.Q4,
      invoiceNumber: topUpInProgressPaymentRequest.invoiceNumber,
      value: topUpInProgressPaymentRequest.value,
      year: topUpInProgressPaymentRequest.marketingYear,
      schedule: topUpInProgressPaymentRequest.schedule,
      sourceSystem: paymentRequestInProgress.sourceSystem,
      originalValue: paymentRequestInProgress.value,
      paymentRequestNumber: topUpInProgressPaymentRequest.paymentRequestNumber
    })
  })

  test('should return downward adjustment in progress payment request if top up then downward adjustment', async () => {
    await db.paymentRequest.create(paymentRequestInProgress)
    await db.paymentRequest.create(paymentRequestCompleted)
    await db.settlement.create(settlement)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(topUpInProgressPaymentRequest)
    await db.paymentRequest.create(topUpCompletedPaymentRequest)
    settlement.invoiceNumber = invoiceNumbers.SFI_SECOND_PAYMENT
    await db.settlement.create(settlement)

    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_THIRD_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_THIRD_PAYMENT_ORIGINAL })

    downwardAdjustmentInProgressPaymentRequest.invoiceNumber = invoiceNumbers.SFI_THIRD_PAYMENT
    downwardAdjustmentInProgressPaymentRequest.paymentRequestNumber = 3
    downwardAdjustmentInProgressPaymentRequest.correlationId = CORRELATION_ID_SECOND_POST_PAYMENT_ADJUSTMENT
    await db.paymentRequest.create(downwardAdjustmentInProgressPaymentRequest)

    downwardAdjustmentCompletedPaymentRequest.invoiceNumber = invoiceNumbers.SFI_THIRD_PAYMENT
    downwardAdjustmentCompletedPaymentRequest.paymentRequestNumber = 3
    downwardAdjustmentCompletedPaymentRequest.correlationId = CORRELATION_ID_SECOND_POST_PAYMENT_ADJUSTMENT
    downwardAdjustmentCompletedPaymentRequest.value = MINUS_NINE_HUNDRED_POUNDS
    await db.paymentRequest.create(downwardAdjustmentCompletedPaymentRequest)

    settlement.invoiceNumber = invoiceNumbers.SFI_THIRD_PAYMENT
    await db.settlement.create(settlement)

    const result = await getLatestInProgressPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED, SETTLEMENT_DATE)

    expect(result).toStrictEqual({
      agreementNumber: downwardAdjustmentInProgressPaymentRequest.agreementNumber,
      paymentRequestId: 5,
      dueDate: new Date(moment(downwardAdjustmentInProgressPaymentRequest.dueDate, 'DD/MM/YYYY')),
      frequency: SCHEDULE_NAMES.Q4,
      invoiceNumber: downwardAdjustmentInProgressPaymentRequest.invoiceNumber,
      value: downwardAdjustmentInProgressPaymentRequest.value,
      year: downwardAdjustmentInProgressPaymentRequest.marketingYear,
      schedule: downwardAdjustmentInProgressPaymentRequest.schedule,
      sourceSystem: paymentRequestInProgress.sourceSystem,
      originalValue: paymentRequestInProgress.value,
      paymentRequestNumber: downwardAdjustmentInProgressPaymentRequest.paymentRequestNumber
    })
  })

  test('should return downward adjustment in progress payment request if downward adjustment then top up', async () => {
    await db.paymentRequest.create(paymentRequestInProgress)
    await db.paymentRequest.create(paymentRequestCompleted)
    await db.settlement.create(settlement)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(downwardAdjustmentInProgressPaymentRequest)
    await db.paymentRequest.create(downwardAdjustmentCompletedPaymentRequest)
    settlement.invoiceNumber = invoiceNumbers.SFI_SECOND_PAYMENT
    await db.settlement.create(settlement)

    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_THIRD_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_THIRD_PAYMENT_ORIGINAL })

    topUpInProgressPaymentRequest.invoiceNumber = invoiceNumbers.SFI_THIRD_PAYMENT
    topUpInProgressPaymentRequest.paymentRequestNumber = 3
    topUpInProgressPaymentRequest.correlationId = CORRELATION_ID_SECOND_POST_PAYMENT_ADJUSTMENT
    await db.paymentRequest.create(topUpInProgressPaymentRequest)

    topUpCompletedPaymentRequest.invoiceNumber = invoiceNumbers.SFI_THIRD_PAYMENT
    topUpCompletedPaymentRequest.paymentRequestNumber = 3
    topUpCompletedPaymentRequest.correlationId = CORRELATION_ID_SECOND_POST_PAYMENT_ADJUSTMENT
    topUpCompletedPaymentRequest.value = NINE_HUNDRED_POUNDS
    await db.paymentRequest.create(topUpCompletedPaymentRequest)

    settlement.invoiceNumber = invoiceNumbers.SFI_THIRD_PAYMENT
    await db.settlement.create(settlement)

    const result = await getLatestInProgressPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED, SETTLEMENT_DATE)

    expect(result).toStrictEqual({
      agreementNumber: topUpInProgressPaymentRequest.agreementNumber,
      paymentRequestId: 5,
      dueDate: new Date(moment(topUpInProgressPaymentRequest.dueDate, 'DD/MM/YYYY')),
      frequency: SCHEDULE_NAMES.Q4,
      invoiceNumber: topUpInProgressPaymentRequest.invoiceNumber,
      value: topUpInProgressPaymentRequest.value,
      year: topUpInProgressPaymentRequest.marketingYear,
      schedule: topUpInProgressPaymentRequest.schedule,
      sourceSystem: paymentRequestInProgress.sourceSystem,
      originalValue: paymentRequestInProgress.value,
      paymentRequestNumber: topUpInProgressPaymentRequest.paymentRequestNumber
    })
  })

  test('should return downward adjustment in progress payment request if top up then split', async () => {
    await db.paymentRequest.create(paymentRequestInProgress)
    await db.paymentRequest.create(paymentRequestCompleted)
    await db.settlement.create(settlement)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(topUpInProgressPaymentRequest)
    await db.paymentRequest.create(topUpCompletedPaymentRequest)
    settlement.invoiceNumber = invoiceNumbers.SFI_SECOND_PAYMENT
    await db.settlement.create(settlement)

    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_THIRD_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_THIRD_PAYMENT_ORIGINAL })

    splitInProgressPaymentRequest.invoiceNumber = invoiceNumbers.SFI_THIRD_PAYMENT
    splitInProgressPaymentRequest.paymentRequestNumber = 3
    splitInProgressPaymentRequest.correlationId = CORRELATION_ID_SECOND_POST_PAYMENT_ADJUSTMENT
    await db.paymentRequest.create(splitInProgressPaymentRequest)

    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SPLIT_THIRD_A, originalInvoiceNumber: invoiceNumbers.SFI_THIRD_PAYMENT_ORIGINAL })
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SPLIT_THIRD_B, originalInvoiceNumber: invoiceNumbers.SFI_THIRD_PAYMENT_ORIGINAL })

    splitACompletedPaymentRequest.invoiceNumber = invoiceNumbers.SFI_SPLIT_THIRD_A
    splitACompletedPaymentRequest.paymentRequestNumber = 3
    splitACompletedPaymentRequest.correlationId = CORRELATION_ID_SECOND_POST_PAYMENT_ADJUSTMENT
    splitACompletedPaymentRequest.value = MINUS_FOUR_HUNDRED_AND_FIFTY_POUNDS
    await db.paymentRequest.create(splitACompletedPaymentRequest)

    splitBCompletedPaymentRequest.invoiceNumber = invoiceNumbers.SFI_SPLIT_THIRD_B
    splitBCompletedPaymentRequest.paymentRequestNumber = 3
    splitBCompletedPaymentRequest.correlationId = CORRELATION_ID_SECOND_POST_PAYMENT_ADJUSTMENT
    splitBCompletedPaymentRequest.value = MINUS_FOUR_HUNDRED_AND_FIFTY_POUNDS
    await db.paymentRequest.create(splitBCompletedPaymentRequest)

    settlement.invoiceNumber = invoiceNumbers.SFI_SPLIT_THIRD_A
    await db.settlement.create(settlement)
    settlement.invoiceNumber = invoiceNumbers.SFI_SPLIT_THIRD_B
    await db.settlement.create(settlement)

    const result = await getLatestInProgressPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED, SETTLEMENT_DATE)

    expect(result).toStrictEqual({
      agreementNumber: splitInProgressPaymentRequest.agreementNumber,
      paymentRequestId: 5,
      dueDate: new Date(moment(splitInProgressPaymentRequest.dueDate, 'DD/MM/YYYY')),
      frequency: SCHEDULE_NAMES.Q4,
      invoiceNumber: splitInProgressPaymentRequest.invoiceNumber,
      value: splitInProgressPaymentRequest.value,
      year: splitInProgressPaymentRequest.marketingYear,
      schedule: splitInProgressPaymentRequest.schedule,
      sourceSystem: paymentRequestInProgress.sourceSystem,
      originalValue: paymentRequestInProgress.value,
      paymentRequestNumber: splitInProgressPaymentRequest.paymentRequestNumber
    })
  })

  test('should return top up in progress payment request if recovery then top up', async () => {
    await db.paymentRequest.create(paymentRequestInProgress)
    await db.paymentRequest.create(paymentRequestCompleted)
    await db.settlement.create(settlement)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(recoveryInProgressPaymentRequest)
    await db.paymentRequest.create(recoveryCompletedPaymentRequest)
    settlement.invoiceNumber = invoiceNumbers.SFI_SECOND_PAYMENT
    await db.settlement.create(settlement)

    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_THIRD_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_THIRD_PAYMENT_ORIGINAL })

    topUpInProgressPaymentRequest.invoiceNumber = invoiceNumbers.SFI_THIRD_PAYMENT
    topUpInProgressPaymentRequest.paymentRequestNumber = 3
    topUpInProgressPaymentRequest.correlationId = CORRELATION_ID_SECOND_POST_PAYMENT_ADJUSTMENT
    await db.paymentRequest.create(topUpInProgressPaymentRequest)

    topUpCompletedPaymentRequest.invoiceNumber = invoiceNumbers.SFI_THIRD_PAYMENT
    topUpCompletedPaymentRequest.paymentRequestNumber = 3
    topUpCompletedPaymentRequest.correlationId = CORRELATION_ID_SECOND_POST_PAYMENT_ADJUSTMENT
    topUpCompletedPaymentRequest.value = NINE_HUNDRED_POUNDS
    await db.paymentRequest.create(topUpCompletedPaymentRequest)

    settlement.invoiceNumber = invoiceNumbers.SFI_THIRD_PAYMENT
    await db.settlement.create(settlement)

    const result = await getLatestInProgressPaymentRequest(PAYMENT_REQUEST_ID_COMPLETED, SETTLEMENT_DATE)

    expect(result).toStrictEqual({
      agreementNumber: topUpInProgressPaymentRequest.agreementNumber,
      paymentRequestId: 5,
      dueDate: new Date(moment(topUpInProgressPaymentRequest.dueDate, 'DD/MM/YYYY')),
      frequency: SCHEDULE_NAMES.Q4,
      invoiceNumber: topUpInProgressPaymentRequest.invoiceNumber,
      value: topUpInProgressPaymentRequest.value,
      year: topUpInProgressPaymentRequest.marketingYear,
      schedule: topUpInProgressPaymentRequest.schedule,
      sourceSystem: paymentRequestInProgress.sourceSystem,
      originalValue: paymentRequestInProgress.value,
      paymentRequestNumber: topUpInProgressPaymentRequest.paymentRequestNumber
    })
  })
})
