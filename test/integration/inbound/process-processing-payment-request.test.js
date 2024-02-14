jest.useFakeTimers().setSystemTime(new Date(2022, 7, 5, 12, 0, 0, 0))

const db = require('../../../app/data')

const {
  SFI_PILOT: SFI_PILOT_SCHEME_ID,
  LNR: LNR_SCHEME_ID,
  LUMP_SUMS: LUMP_SUMS_SCHEME_ID,
  VET_VISITS: VET_VISITS_SCHEME_ID
} = require('../../../app/constants/scheme-ids')
const { IN_PROGRESS } = require('../../../app/constants/statuses')

const { reverseEngineerInvoiceNumber } = require('../../../app/utility')
const processProcessingPaymentRequest = require('../../../app/inbound/processing')

let paymentRequest

describe('process processing payment request', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    const schemes = JSON.parse(JSON.stringify(require('../../../app/constants/schemes')))
    const fundingOptions = JSON.parse(JSON.stringify(require('../../../app/constants/funding-options')))
    paymentRequest = JSON.parse(JSON.stringify(require('../../mock-objects/mock-payment-request').processingPaymentRequest))

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
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.invoiceNumber.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into invoiceNumber where paymentRequest.invoiceNumber', async () => {
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.invoiceNumber.count({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result).toBe(1)
  })

  test('should save entry into invoiceNumber where paymentRequest.invoiceNumber when paymentRequest.schemeId is SFI_PILOT', async () => {
    paymentRequest.schemeId = SFI_PILOT_SCHEME_ID

    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.invoiceNumber.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into invoiceNumber where paymentRequest.invoiceNumber when paymentRequest.schemeId is SFI_PILOT', async () => {
    paymentRequest.schemeId = SFI_PILOT_SCHEME_ID

    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.invoiceNumber.count({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result).toBe(1)
  })

  test('should save entry into invoiceNumber where paymentRequest.invoiceNumber when paymentRequest.schemeId is LNR', async () => {
    paymentRequest.schemeId = LNR_SCHEME_ID

    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.invoiceNumber.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into invoiceNumber where paymentRequest.invoiceNumber when paymentRequest.schemeId is LNR', async () => {
    paymentRequest.schemeId = LNR_SCHEME_ID

    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.invoiceNumber.count({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result).toBe(1)
  })

  test('should save entry into invoiceNumber where paymentRequest.invoiceNumber when paymentRequest.schemeId is LUMP_SUMS', async () => {
    paymentRequest.schemeId = LUMP_SUMS_SCHEME_ID

    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.invoiceNumber.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into invoiceNumber where paymentRequest.invoiceNumber when paymentRequest.schemeId is LUMP_SUMS', async () => {
    paymentRequest.schemeId = LUMP_SUMS_SCHEME_ID

    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.invoiceNumber.count({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result).toBe(1)
  })

  test('should save entry into invoiceNumber where paymentRequest.invoiceNumber when paymentRequest.schemeId is VET_VISITS', async () => {
    paymentRequest.schemeId = VET_VISITS_SCHEME_ID

    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.invoiceNumber.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into invoiceNumber where paymentRequest.invoiceNumber when paymentRequest.schemeId is VET_VISITS', async () => {
    paymentRequest.schemeId = VET_VISITS_SCHEME_ID

    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.invoiceNumber.count({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result).toBe(1)
  })

  test('should save entry into invoiceNumber with invoiceNumber given by paymentRequest.invoiceNumber where paymentRequest.invoiceNumber', async () => {
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.invoiceNumber.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result.invoiceNumber).toBe(paymentRequest.invoiceNumber)
  })

  test('should save entry into invoiceNumber with originalInvoiceNumber given by reverseEngineerInvoiceNumber where paymentRequest.invoiceNumber', async () => {
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.invoiceNumber.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    const originalInvoiceNumber = reverseEngineerInvoiceNumber(paymentRequest.invoiceNumber)
    expect(result.originalInvoiceNumber).toBe(originalInvoiceNumber)
  })

  test('should save entry into paymentRequest where paymentRequest.invoiceNumber', async () => {
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into paymentRequest where paymentRequest.invoiceNumber', async () => {
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.count({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result).toBe(1)
  })

  test('should save entry into paymentRequest where paymentRequest.invoiceNumber when paymentRequest.schemeId is SFI_PILOT', async () => {
    paymentRequest.schemeId = SFI_PILOT_SCHEME_ID

    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into paymentRequest where paymentRequest.invoiceNumber when paymentRequest.schemeId is SFI_PILOT', async () => {
    paymentRequest.schemeId = SFI_PILOT_SCHEME_ID

    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.count({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result).toBe(1)
  })

  test('should save entry into paymentRequest where paymentRequest.invoiceNumber when paymentRequest.schemeId is LNR', async () => {
    paymentRequest.schemeId = LNR_SCHEME_ID

    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into paymentRequest where paymentRequest.invoiceNumber when paymentRequest.schemeId is LNR', async () => {
    paymentRequest.schemeId = LNR_SCHEME_ID

    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.count({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result).toBe(1)
  })

  test('should save entry into paymentRequest where paymentRequest.invoiceNumber when paymentRequest.schemeId is LUMP_SUMS', async () => {
    paymentRequest.schemeId = LUMP_SUMS_SCHEME_ID

    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into paymentRequest where paymentRequest.invoiceNumber when paymentRequest.schemeId is LUMP_SUMS', async () => {
    paymentRequest.schemeId = LUMP_SUMS_SCHEME_ID

    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.count({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result).toBe(1)
  })

  test('should save entry into paymentRequest where paymentRequest.invoiceNumber when paymentRequest.schemeId is VET_VISITS', async () => {
    paymentRequest.schemeId = VET_VISITS_SCHEME_ID

    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into paymentRequest where paymentRequest.invoiceNumber when paymentRequest.schemeId is VET_VISITS', async () => {
    paymentRequest.schemeId = VET_VISITS_SCHEME_ID

    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.count({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result).toBe(1)
  })

  test('should save paymentRequestId as 1 into paymentRequest where paymentRequest.invoiceNumber', async () => {
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result.paymentRequestId).toBe(1)
  })

  test('should save paymentRequestId as 1 into paymentRequest where paymentRequest.invoiceNumber when paymentRequest.paymentRequestId is not 1', async () => {
    paymentRequest.paymentRequestId = 99

    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result.paymentRequestId).toBe(1)
  })

  test('should save entry into paymentRequest with agreementNumber as paymentRequest.agreementNumber where paymentRequest.invoiceNumber', async () => {
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result.agreementNumber).toBe(paymentRequest.agreementNumber)
  })

  test('should save entry into paymentRequest with contractNumber as paymentRequest.contractNumber where paymentRequest.invoiceNumber', async () => {
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result.contractNumber).toBe(paymentRequest.contractNumber)
  })

  test('should save entry into paymentRequest with correlationId as paymentRequest.correlationId where paymentRequest.invoiceNumber', async () => {
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result.correlationId).toBe(paymentRequest.correlationId)
  })

  test('should save entry into paymentRequest with currency as paymentRequest.currency where paymentRequest.invoiceNumber', async () => {
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result.currency).toBe(paymentRequest.currency)
  })

  test('should save entry into paymentRequest with deliveryBody as paymentRequest.deliveryBody where paymentRequest.invoiceNumber', async () => {
    await processProcessingPaymentRequest(paymentRequest)
    const result = await db.paymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result.deliveryBody).toBe(paymentRequest.deliveryBody)
  })

  test('should save entry into paymentRequest with dueDate as paymentRequest.dueDate where paymentRequest.invoiceNumber', async () => {
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result.dueDate).toBe(paymentRequest.dueDate)
  })

  test('should save entry into paymentRequest with marketingYear as paymentRequest.marketingYear where paymentRequest.invoiceNumber', async () => {
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result.marketingYear).toBe(paymentRequest.marketingYear)
  })

  test('should save entry into paymentRequest with invoiceNumber as paymentRequest.invoiceNumber where paymentRequest.invoiceNumber', async () => {
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result.invoiceNumber).toBe(paymentRequest.invoiceNumber)
  })

  test('should save entry into paymentRequest with schedule as paymentRequest.schedule where paymentRequest.invoiceNumber', async () => {
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result.schedule).toBe(paymentRequest.schedule)
  })

  test('should save entry into paymentRequest with sourceSystem as paymentRequest.sourceSystem where paymentRequest.invoiceNumber', async () => {
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result.sourceSystem).toBe(paymentRequest.sourceSystem)
  })

  test('should save entry into paymentRequest with schemeId as paymentRequest.schemeId where paymentRequest.invoiceNumber', async () => {
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result.schemeId).toBe(paymentRequest.schemeId)
  })

  test('should save entry into paymentRequest with received given by Date where paymentRequest.invoiceNumber', async () => {
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result.received).toStrictEqual(new Date())
  })

  test('should save entry into paymentRequest with status as IN_PROGRESS where paymentRequest.invoiceNumber', async () => {
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result.status).toBe(IN_PROGRESS)
  })

  test('should save entry into paymentRequest with value as paymentRequest.value where paymentRequest.invoiceNumber', async () => {
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result.value).toBe(paymentRequest.value)
  })

  test('should not save paymentRequest.invoiceLines into entry where paymentRequest.invoiceNumber', async () => {
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result.invoiceLines).toBeUndefined()
  })

  test('should save paymentRequest.paymentRequestNumber into entry where paymentRequest.invoiceNumber', async () => {
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result.paymentRequestNumber).toBe(paymentRequest.paymentRequestNumber)
  })

  test('should save paymentRequest.recoveryDate into entry where paymentRequest.invoiceNumber', async () => {
    paymentRequest.recoveryDate = '01/09/2022'
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result.recoveryDate).toBe(paymentRequest.recoveryDate)
  })

  test('should save paymentRequest.debtType into entry where paymentRequest.invoiceNumber', async () => {
    paymentRequest.debtType = 'irr'
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.paymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(result.debtType).toBe(paymentRequest.debtType)
  })

  test('should save entry into invoiceLine where paymentRequestId is 1', async () => {
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.findOne({ where: { paymentRequestId: 1 } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into invoiceLine where paymentRequestId is 1', async () => {
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.count({ where: { paymentRequestId: 1 } })
    expect(result).toBe(1)
  })

  test('should save entry into invoiceLine where paymentRequestId is 1 when paymentRequest.schemeId is SFI_PILOT', async () => {
    paymentRequest.schemeId = SFI_PILOT_SCHEME_ID

    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.findOne({ where: { paymentRequestId: 1 } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into invoiceLine where paymentRequestId is 1 when paymentRequest.schemeId is SFI_PILOT', async () => {
    paymentRequest.schemeId = SFI_PILOT_SCHEME_ID

    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.count({ where: { paymentRequestId: 1 } })
    expect(result).toBe(1)
  })

  test('should save entry into invoiceLine where paymentRequestId is 1 when paymentRequest.schemeId is LNR', async () => {
    paymentRequest.schemeId = LNR_SCHEME_ID

    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.findOne({ where: { paymentRequestId: 1 } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into invoiceLine where paymentRequestId is 1 when paymentRequest.schemeId is LNR', async () => {
    paymentRequest.schemeId = LNR_SCHEME_ID

    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.count({ where: { paymentRequestId: 1 } })
    expect(result).toBe(1)
  })

  test('should save entry into invoiceLine where paymentRequestId is 1 when paymentRequest.schemeId is LUMP_SUMS', async () => {
    paymentRequest.schemeId = LUMP_SUMS_SCHEME_ID

    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.findOne({ where: { paymentRequestId: 1 } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into invoiceLine where paymentRequestId is 1 when paymentRequest.schemeId is LUMP_SUMS', async () => {
    paymentRequest.schemeId = LUMP_SUMS_SCHEME_ID

    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.count({ where: { paymentRequestId: 1 } })
    expect(result).toBe(1)
  })

  test('should save entry into invoiceLine where paymentRequestId is 1 when paymentRequest.schemeId is VET_VISITS', async () => {
    paymentRequest.schemeId = VET_VISITS_SCHEME_ID

    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.findOne({ where: { paymentRequestId: 1 } })
    expect(result).not.toBeNull()
  })

  test('should save 1 entry into invoiceLine where paymentRequestId is 1 when paymentRequest.schemeId is VET_VISITS', async () => {
    paymentRequest.schemeId = VET_VISITS_SCHEME_ID

    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.count({ where: { paymentRequestId: 1 } })
    expect(result).toBe(1)
  })

  test('should save invoiceLineId as 1 into invoiceLine where paymentRequest.invoiceLines[0].invoiceLineId is undefined', async () => {
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.findOne({ where: { paymentRequestId: 1 } })
    expect(result.invoiceLineId).toBe(1)
  })

  test('should save invoiceLineId as 1 into invoiceLine where paymentRequest.invoiceLines[0].invoiceLineId is 1', async () => {
    paymentRequest.invoiceLines[0].invoiceLineId = 1

    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.findOne({ where: { paymentRequestId: 1 } })
    expect(result.invoiceLineId).toBe(1)
  })

  test('should save invoiceLineId as 1 into invoiceLine where paymentRequest.invoiceLines[0].invoiceLineId is not 1', async () => {
    paymentRequest.invoiceLines[0].invoiceLineId = 99

    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.findOne({ where: { paymentRequestId: 1 } })
    expect(result.invoiceLineId).toBe(1)
  })

  test('should save entry into invoiceLine with accountCode as paymentRequest.invoiceLines[0].accountCode where paymentRequestId is 1', async () => {
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.findOne({ where: { paymentRequestId: 1 } })
    expect(result.accountCode).toBe(paymentRequest.invoiceLines[0].accountCode)
  })

  test('should save entry into invoiceLine with description as paymentRequest.invoiceLines[0].description where paymentRequestId is 1', async () => {
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.findOne({ where: { paymentRequestId: 1 } })
    expect(result.description).toBe(paymentRequest.invoiceLines[0].description)
  })

  test('should save entry into invoiceLine with fundingCode as paymentRequest.invoiceLines[0].schemeCode where paymentRequestId is 1', async () => {
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.findOne({ where: { paymentRequestId: 1 } })
    expect(result.fundingCode).toBe(paymentRequest.invoiceLines[0].schemeCode)
  })

  test('should save entry into invoiceLine with fundCode as paymentRequest.invoiceLines[0].fundCode where paymentRequestId is 1', async () => {
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.findOne({ where: { paymentRequestId: 1 } })
    expect(result.fundCode).toBe(paymentRequest.invoiceLines[0].fundCode)
  })

  test('should save entry into invoiceLine with value as paymentRequest.invoiceLines[0].value where paymentRequestId is 1', async () => {
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.findOne({ where: { paymentRequestId: 1 } })
    expect(result.value).toBe(paymentRequest.invoiceLines[0].value)
  })

  test('should not save paymentRequest.invoiceLines[0].schemeCode into entry where paymentRequestId is 1', async () => {
    await processProcessingPaymentRequest(paymentRequest)

    const result = await db.invoiceLine.findOne({ where: { paymentRequestId: 1 } })
    expect(result.schemeCode).toBeUndefined()
  })
})
