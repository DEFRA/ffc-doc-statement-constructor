jest.useFakeTimers().setSystemTime(new Date(2022, 7, 5, 12, 0, 0, 0))

const db = require('../../../app/data')

const {
  SFI_PILOT: SFI_PILOT_SCHEME_ID,
  LNR: LNR_SCHEME_ID,
  LUMP_SUMS: LUMP_SUMS_SCHEME_ID,
  VET_VISITS: VET_VISITS_SCHEME_ID
} = require('../../../app/constants/scheme-ids')
const { COMPLETED } = require('../../../app/constants/statuses')

const { reverseEngineerInvoiceNumber } = require('../../../app/utility')
const processSubmitPaymentRequest = require('../../../app/inbound/submit')
const { SCHEDULE } = require('../../../app/constants/categories')
const { AR } = require('../../../app/constants/ledgers')

let paymentRequest

describe('process submit payment request', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    const schemes = JSON.parse(JSON.stringify(require('../../../app/constants/schemes')))
    const fundingOptions = JSON.parse(JSON.stringify(require('../../../app/constants/funding-options')))
    paymentRequest = JSON.parse(JSON.stringify(require('../../mock-objects/mock-payment-request').submitPaymentRequest))

    await db.scheme.bulkCreate(schemes)
    await db.fundingOption.bulkCreate(fundingOptions)
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

  test('should save entry into invoiceNumber where paymentRequest.invoiceNumber', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.invoiceNumber.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into invoiceNumber where paymentRequest.invoiceNumber', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.invoiceNumber.count({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result).toBe(1)
  })

  test('should save entry into invoiceNumber where paymentRequest.invoiceNumber when paymentRequest.schemeId is SFI_PILOT', async () => {
    paymentRequest.schemeId = SFI_PILOT_SCHEME_ID

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.invoiceNumber.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into invoiceNumber where paymentRequest.invoiceNumber when paymentRequest.schemeId is SFI_PILOT', async () => {
    paymentRequest.schemeId = SFI_PILOT_SCHEME_ID

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.invoiceNumber.count({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result).toBe(1)
  })

  test('should save entry into invoiceNumber where paymentRequest.invoiceNumber when paymentRequest.schemeId is LNR', async () => {
    paymentRequest.schemeId = LNR_SCHEME_ID

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.invoiceNumber.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into invoiceNumber where paymentRequest.invoiceNumber when paymentRequest.schemeId is LNR', async () => {
    paymentRequest.schemeId = LNR_SCHEME_ID

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.invoiceNumber.count({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result).toBe(1)
  })

  test('should save entry into invoiceNumber where paymentRequest.invoiceNumber when paymentRequest.schemeId is LUMP_SUMS', async () => {
    paymentRequest.schemeId = LUMP_SUMS_SCHEME_ID

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.invoiceNumber.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into invoiceNumber where paymentRequest.invoiceNumber when paymentRequest.schemeId is LUMP_SUMS', async () => {
    paymentRequest.schemeId = LUMP_SUMS_SCHEME_ID

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.invoiceNumber.count({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result).toBe(1)
  })

  test('should save entry into invoiceNumber where paymentRequest.invoiceNumber when paymentRequest.schemeId is VET_VISITS', async () => {
    paymentRequest.schemeId = VET_VISITS_SCHEME_ID

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.invoiceNumber.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into invoiceNumber where paymentRequest.invoiceNumber when paymentRequest.schemeId is VET_VISITS', async () => {
    paymentRequest.schemeId = VET_VISITS_SCHEME_ID

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.invoiceNumber.count({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result).toBe(1)
  })

  test('should save entry into invoiceNumber with invoiceNumber given by paymentRequest.invoiceNumber where paymentRequest.invoiceNumber', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.invoiceNumber.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result.invoiceNumber).toBe(paymentRequest.invoiceNumber)
  })

  test('should save entry into invoiceNumber with originalInvoiceNumber given by reverseEngineerInvoiceNumber where paymentRequest.invoiceNumber', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.invoiceNumber.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    const originalInvoiceNumber = reverseEngineerInvoiceNumber(paymentRequest.invoiceNumber)
    expect(result.originalInvoiceNumber).toBe(originalInvoiceNumber)
  })

  test('should save entry into paymentRequest where paymentRequest.referenceId', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { referenceId: paymentRequest.referenceId } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into paymentRequest where paymentRequest.referenceId', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.count({ where: { referenceId: paymentRequest.referenceId } })
    expect(result).toBe(1)
  })

  test('should save entry into paymentRequest where paymentRequest.referenceId when paymentRequest.schemeId is SFI_PILOT', async () => {
    paymentRequest.schemeId = SFI_PILOT_SCHEME_ID

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { referenceId: paymentRequest.referenceId } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into paymentRequest where paymentRequest.referenceId when paymentRequest.schemeId is SFI_PILOT', async () => {
    paymentRequest.schemeId = SFI_PILOT_SCHEME_ID

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.count({ where: { referenceId: paymentRequest.referenceId } })
    expect(result).toBe(1)
  })

  test('should save entry into paymentRequest where paymentRequest.referenceId when paymentRequest.schemeId is LNR', async () => {
    paymentRequest.schemeId = LNR_SCHEME_ID

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { referenceId: paymentRequest.referenceId } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into paymentRequest where paymentRequest.referenceId when paymentRequest.schemeId is LNR', async () => {
    paymentRequest.schemeId = LNR_SCHEME_ID

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.count({ where: { referenceId: paymentRequest.referenceId } })
    expect(result).toBe(1)
  })

  test('should save entry into paymentRequest where paymentRequest.referenceId when paymentRequest.schemeId is LUMP_SUMS', async () => {
    paymentRequest.schemeId = LUMP_SUMS_SCHEME_ID

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { referenceId: paymentRequest.referenceId } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into paymentRequest where paymentRequest.referenceId when paymentRequest.schemeId is LUMP_SUMS', async () => {
    paymentRequest.schemeId = LUMP_SUMS_SCHEME_ID

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.count({ where: { referenceId: paymentRequest.referenceId } })
    expect(result).toBe(1)
  })

  test('should save entry into paymentRequest where paymentRequest.referenceId when paymentRequest.schemeId is VET_VISITS', async () => {
    paymentRequest.schemeId = VET_VISITS_SCHEME_ID

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { referenceId: paymentRequest.referenceId } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into paymentRequest where paymentRequest.referenceId when paymentRequest.schemeId is VET_VISITS', async () => {
    paymentRequest.schemeId = VET_VISITS_SCHEME_ID

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.count({ where: { referenceId: paymentRequest.referenceId } })
    expect(result).toBe(1)
  })

  test('should save paymentRequestId as 1 into paymentRequest where paymentRequest.referenceId', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { referenceId: paymentRequest.referenceId } })
    expect(result.paymentRequestId).toBe(1)
  })

  test('should save paymentRequestId as 1 into paymentRequest where paymentRequest.referenceId when paymentRequest.paymentRequestId is not 1', async () => {
    paymentRequest.paymentRequestId = 99

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { referenceId: paymentRequest.referenceId } })
    expect(result.paymentRequestId).toBe(1)
  })

  test('should save entry into paymentRequest with agreementNumber as paymentRequest.agreementNumber where paymentRequest.referenceId', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { referenceId: paymentRequest.referenceId } })
    expect(result.agreementNumber).toBe(paymentRequest.agreementNumber)
  })

  test('should save entry into paymentRequest with contractNumber as paymentRequest.contractNumber where paymentRequest.referenceId', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { referenceId: paymentRequest.referenceId } })
    expect(result.contractNumber).toBe(paymentRequest.contractNumber)
  })

  test('should save entry into paymentRequest with correlationId as paymentRequest.correlationId where paymentRequest.referenceId', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { referenceId: paymentRequest.referenceId } })
    expect(result.correlationId).toBe(paymentRequest.correlationId)
  })

  test('should save entry into paymentRequest with currency as paymentRequest.currency where paymentRequest.referenceId', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { referenceId: paymentRequest.referenceId } })
    expect(result.currency).toBe(paymentRequest.currency)
  })

  test('should save entry into paymentRequest with deliveryBody as paymentRequest.deliveryBody where paymentRequest.referenceId', async () => {
    await processSubmitPaymentRequest(paymentRequest)
    const result = await db.paymentRequest.findOne({ where: { referenceId: paymentRequest.referenceId } })
    expect(result.deliveryBody).toBe(paymentRequest.deliveryBody)
  })

  test('should save entry into paymentRequest with dueDate as paymentRequest.dueDate where paymentRequest.referenceId', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { referenceId: paymentRequest.referenceId } })
    expect(result.dueDate).toBe(paymentRequest.dueDate)
  })

  test('should save entry into paymentRequest with marketingYear as paymentRequest.marketingYear where paymentRequest.referenceId', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { referenceId: paymentRequest.referenceId } })
    expect(result.marketingYear).toBe(paymentRequest.marketingYear)
  })

  test('should save entry into paymentRequest with referenceId as paymentRequest.referenceId where paymentRequest.referenceId', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { referenceId: paymentRequest.referenceId } })
    expect(result.referenceId).toBe(paymentRequest.referenceId)
  })

  test('should save entry into paymentRequest with schedule as paymentRequest.schedule where paymentRequest.referenceId', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { referenceId: paymentRequest.referenceId } })
    expect(result.schedule).toBe(paymentRequest.schedule)
  })

  test('should save entry into paymentRequest with schemeId as paymentRequest.schemeId where paymentRequest.referenceId', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { referenceId: paymentRequest.referenceId } })
    expect(result.schemeId).toBe(paymentRequest.schemeId)
  })

  test('should save entry into paymentRequest with sourceSystem as paymentRequest.sourceSystem where paymentRequest.referenceId', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { referenceId: paymentRequest.referenceId } })
    expect(result.sourceSystem).toBe(paymentRequest.sourceSystem)
  })

  test('should save entry into paymentRequest with received given by Date where paymentRequest.referenceId', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { referenceId: paymentRequest.referenceId } })
    expect(result.received).toStrictEqual(new Date())
  })

  test('should save entry into paymentRequest with status as COMPLETED where paymentRequest.referenceId', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { referenceId: paymentRequest.referenceId } })
    expect(result.status).toBe(COMPLETED)
  })

  test('should save entry into paymentRequest with value as paymentRequest.value where paymentRequest.referenceId', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { referenceId: paymentRequest.referenceId } })
    expect(result.value).toBe(paymentRequest.value)
  })

  test('should not save paymentRequest.invoiceLines into entry where paymentRequest.referenceId', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { referenceId: paymentRequest.referenceId } })
    expect(result.invoiceLines).toBeUndefined()
  })

  test('should save paymentRequest.paymentRequestNumber into entry where referenceId', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { referenceId: paymentRequest.referenceId } })
    expect(result.paymentRequestNumber).toBe(paymentRequest.paymentRequestNumber)
  })

  test('should save paymentRequest.recoveryDate into entry where referenceId', async () => {
    paymentRequest.recoveryDate = '01/09/2022'
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { referenceId: paymentRequest.referenceId } })
    expect(result.recoveryDate).toBe(paymentRequest.recoveryDate)
  })

  test('should save paymentRequest.debtType into entry where referenceId', async () => {
    paymentRequest.debtType = 'irr'
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { referenceId: paymentRequest.referenceId } })
    expect(result.debtType).toBe(paymentRequest.debtType)
  })

  test('should save entry into invoiceLine where paymentRequestId is 1', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.findOne({ where: { paymentRequestId: 1 } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into invoiceLine where paymentRequestId is 1', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.count({ where: { paymentRequestId: 1 } })
    expect(result).toBe(1)
  })

  test('should save entry into invoiceLine where paymentRequestId is 1 when paymentRequest.schemeId is SFI_PILOT', async () => {
    paymentRequest.schemeId = SFI_PILOT_SCHEME_ID

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.findOne({ where: { paymentRequestId: 1 } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into invoiceLine where paymentRequestId is 1 when paymentRequest.schemeId is SFI_PILOT', async () => {
    paymentRequest.schemeId = SFI_PILOT_SCHEME_ID

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.count({ where: { paymentRequestId: 1 } })
    expect(result).toBe(1)
  })

  test('should save entry into invoiceLine where paymentRequestId is 1 when paymentRequest.schemeId is LNR', async () => {
    paymentRequest.schemeId = LNR_SCHEME_ID

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.findOne({ where: { paymentRequestId: 1 } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into invoiceLine where paymentRequestId is 1 when paymentRequest.schemeId is LNR', async () => {
    paymentRequest.schemeId = LNR_SCHEME_ID

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.count({ where: { paymentRequestId: 1 } })
    expect(result).toBe(1)
  })

  test('should save entry into invoiceLine where paymentRequestId is 1 when paymentRequest.schemeId is LUMP_SUMS', async () => {
    paymentRequest.schemeId = LUMP_SUMS_SCHEME_ID

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.findOne({ where: { paymentRequestId: 1 } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into invoiceLine where paymentRequestId is 1 when paymentRequest.schemeId is LUMP_SUMS', async () => {
    paymentRequest.schemeId = LUMP_SUMS_SCHEME_ID

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.count({ where: { paymentRequestId: 1 } })
    expect(result).toBe(1)
  })

  test('should save entry into invoiceLine where paymentRequestId is 1 when paymentRequest.schemeId is VET_VISITS', async () => {
    paymentRequest.schemeId = VET_VISITS_SCHEME_ID

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.findOne({ where: { paymentRequestId: 1 } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into invoiceLine where paymentRequestId is 1 when paymentRequest.schemeId is VET_VISITS', async () => {
    paymentRequest.schemeId = VET_VISITS_SCHEME_ID

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.count({ where: { paymentRequestId: 1 } })
    expect(result).toBe(1)
  })

  test('should save invoiceLineId as 1 into invoiceLine where paymentRequest.invoiceLines[0].invoiceLineId is undefined', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.findOne({ where: { paymentRequestId: 1 } })
    expect(result.invoiceLineId).toBe(1)
  })

  test('should save invoiceLineId as 1 into invoiceLine where paymentRequest.invoiceLines[0].invoiceLineId is 1', async () => {
    paymentRequest.invoiceLines[0].invoiceLineId = 1

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.findOne({ where: { paymentRequestId: 1 } })
    expect(result.invoiceLineId).toBe(1)
  })

  test('should save invoiceLineId as 1 into invoiceLine where paymentRequest.invoiceLines[0].invoiceLineId is not 1', async () => {
    paymentRequest.invoiceLines[0].invoiceLineId = 99

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.findOne({ where: { paymentRequestId: 1 } })
    expect(result.invoiceLineId).toBe(1)
  })

  test('should save entry into invoiceLine with accountCode as paymentRequest.invoiceLines[0].accountCode where paymentRequestId is 1', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.findOne({ where: { paymentRequestId: 1 } })
    expect(result.accountCode).toBe(paymentRequest.invoiceLines[0].accountCode)
  })

  test('should save entry into invoiceLine with description as paymentRequest.invoiceLines[0].description where paymentRequestId is 1', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.findOne({ where: { paymentRequestId: 1 } })
    expect(result.description).toBe(paymentRequest.invoiceLines[0].description)
  })

  test('should save entry into invoiceLine with fundingCode as paymentRequest.invoiceLines[0].schemeCode where paymentRequestId is 1', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.findOne({ where: { paymentRequestId: 1 } })
    expect(result.fundingCode).toBe(paymentRequest.invoiceLines[0].schemeCode)
  })

  test('should save entry into invoiceLine with fundCode as paymentRequest.invoiceLines[0].fundCode where paymentRequestId is 1', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.findOne({ where: { paymentRequestId: 1 } })
    expect(result.fundCode).toBe(paymentRequest.invoiceLines[0].fundCode)
  })

  test('should save entry into invoiceLine with value as paymentRequest.invoiceLines[0].value where paymentRequestId is 1', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.findOne({ where: { paymentRequestId: 1 } })
    expect(result.value).toBe(paymentRequest.invoiceLines[0].value)
  })

  test('should not save paymentRequest.invoiceLines[0].schemeCode into entry where paymentRequestId is 1', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.findOne({ where: { paymentRequestId: 1 } })
    expect(result.schemeCode).toBeUndefined()
  })

  test('should save frn in paymentRequests table when valid payment request received', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { referenceId: paymentRequest.referenceId } })
    expect(result.frn).toBe(paymentRequest.frn.toString())
  })

  test('should not save entry in schedule table when first payment', async () => {
    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.schedule.count({ where: { paymentRequestId: 1 } })
    expect(result).toBe(0)
  })

  test('should not save entry in schedule table when payment request has no schedule', async () => {
    delete paymentRequest.schedule
    paymentRequest.paymentRequestNumber = 2

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.schedule.count({ where: { paymentRequestId: 1 } })
    expect(result).toBe(0)
  })

  test('should not save entry in schedule table when payment request has null schedule', async () => {
    paymentRequest.schedule = null
    paymentRequest.paymentRequestNumber = 2

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.schedule.count({ where: { paymentRequestId: 1 } })
    expect(result).toBe(0)
  })

  test('should not save entry in schedule table when payment request is not AP', async () => {
    paymentRequest.ledger = AR
    paymentRequest.paymentRequestNumber = 2

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.schedule.count({ where: { paymentRequestId: 1 } })
    expect(result).toBe(0)
  })

  test('should not save entry in schedule table when payment request has undefined schedule', async () => {
    paymentRequest.schedule = undefined
    paymentRequest.paymentRequestNumber = 2

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.schedule.count({ where: { paymentRequestId: 1 } })
    expect(result).toBe(0)
  })

  test('should save entry in schedule table when paymentRequestNumber greater than 1', async () => {
    paymentRequest.paymentRequestNumber = 2

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.schedule.count({ where: { paymentRequestId: 1 } })
    expect(result).toBe(1)
  })

  test('should save entry in schedule table when paymentRequestNumber greater than 1 with null start date', async () => {
    paymentRequest.paymentRequestNumber = 2
    paymentRequest.startDate = ''

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.schedule.count({ where: { paymentRequestId: 1, started: null } })
    expect(result).toBe(1)
  })

  test('should save entry in schedule table when paymentRequestNumber greater than 1 with null completed date', async () => {
    paymentRequest.paymentRequestNumber = 2

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.schedule.count({ where: { paymentRequestId: 1, completed: null } })
    expect(result).toBe(1)
  })

  test('should save entry in schedule table when paymentRequestNumber greater than 1 with schedule category', async () => {
    paymentRequest.paymentRequestNumber = 2

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.schedule.count({ where: { paymentRequestId: 1, category: SCHEDULE } })
    expect(result).toBe(1)
  })

  test('should save entry in schedule table when paymentRequestNumber greater than 1 with null settlementId', async () => {
    paymentRequest.paymentRequestNumber = 2

    await processSubmitPaymentRequest(paymentRequest)

    const result = await db.schedule.count({ where: { paymentRequestId: 1, settlementId: null } })
    expect(result).toBe(1)
  })
})
