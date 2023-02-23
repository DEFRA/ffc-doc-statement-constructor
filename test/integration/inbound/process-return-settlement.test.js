const { AP } = require('../../../app/constants/ledgers')
const db = require('../../../app/data')

const processReturnSettlement = require('../../../app/inbound/return')

let settlement
let submitPaymentRequest
let processingPaymentRequest

describe('process return settlement', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    const schemes = JSON.parse(JSON.stringify(require('../../../app/constants/schemes')))
    const {
      SFI_FIRST_PAYMENT: invoiceNumber,
      SFI_FIRST_PAYMENT_ORIGINAL: originalInvoiceNumber
    } = JSON.parse(JSON.stringify(require('../../mock-components/mock-invoice-number')))
    settlement = JSON.parse(JSON.stringify(require('../../mock-objects/mock-settlement')))
    submitPaymentRequest = JSON.parse(JSON.stringify(require('../../mock-objects/mock-payment-request').submitPaymentRequest))
    processingPaymentRequest = JSON.parse(JSON.stringify(require('../../mock-objects/mock-payment-request').processingPaymentRequest))

    await db.scheme.bulkCreate(schemes)
    await db.invoiceNumber.create({ invoiceNumber, originalInvoiceNumber })
    await db.paymentRequest.create(submitPaymentRequest)
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

  test('should save entry into settlement table with invoiceNumber of settlement.invoiceNumber', async () => {
    await processReturnSettlement(settlement)

    const result = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
    expect(result).not.toBeNull()
  })

  test('should save one entry into settlement table with invoiceNumber of settlement.invoiceNumber', async () => {
    await processReturnSettlement(settlement)

    const result = await db.settlement.count({ where: { invoiceNumber: settlement.invoiceNumber } })
    expect(result).toBe(1)
  })

  test('should save entry into settlement table with value of settlement.value', async () => {
    await processReturnSettlement(settlement)

    const result = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
    expect(result.value).toBe(settlement.value)
  })

  test('should save entry into settlement table with reference of settlement.reference', async () => {
    await processReturnSettlement(settlement)

    const result = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
    expect(result.reference).toBe(settlement.reference)
  })

  test('should save entry into settlement table with settlementDate of settlement.settlementDate', async () => {
    await processReturnSettlement(settlement)

    const result = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
    expect(result.settlementDate).toStrictEqual(new Date(settlement.settlementDate))
  })

  test('should save sourceSystem in the table when valid settlement received ', async () => {
    await processReturnSettlement(settlement)

    const result = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
    expect(result.sourceSystem).toBe(settlement.sourceSystem)
  })

  test('should save frn in the table when valid settlement received ', async () => {
    await processReturnSettlement(settlement)

    const result = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
    expect(result.frn).toBe(settlement.frn.toString())
  })

  test('should save ledger as AP in the table when valid settlement received ', async () => {
    await processReturnSettlement(settlement)

    const result = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
    expect(result.ledger).toBe(AP)
  })

  test('should save received date in the table when valid settlement received ', async () => {
    await processReturnSettlement(settlement)

    const result = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
    expect(result.receivedDate).not.toBeNull()
  })

  test('should save settlement with paymentRequestId of paymentRequest.PaymentRequestId when matching paymentRequest with status of "Completed" is found ', async () => {
    await processReturnSettlement(settlement)

    const result = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
    expect(result.paymentRequestId).toBe(submitPaymentRequest.paymentRequestId)
  })

  test('should save settlement with paymentRequestId of null when paymentRequest table is empty ', async () => {
    const paymentRequestToRemove = await db.paymentRequest.findOne({ where: x => x.paymentRequestId === 1 })
    await paymentRequestToRemove.destroy()

    await processReturnSettlement(settlement)

    const result = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
    expect(result.paymentRequestId).toBeNull()
  })

  test('should save settlement with paymentRequestId of null when no matching paymentRequest found', async () => {
    const {
      SFI_SECOND_PAYMENT: invoiceNumber,
      SFI_SECOND_PAYMENT_ORIGINAL: originalInvoiceNumber
    } = JSON.parse(JSON.stringify(require('../../mock-components/mock-invoice-number')))

    const paymentRequestToRemove = await db.paymentRequest.findOne({ where: x => x.paymentRequestId === 1 })
    await paymentRequestToRemove.destroy()
    await db.invoiceNumber.create({ invoiceNumber, originalInvoiceNumber })
    submitPaymentRequest.invoiceNumber = invoiceNumber
    await db.paymentRequest.create(submitPaymentRequest)

    await processReturnSettlement(settlement)

    const result = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
    expect(result.paymentRequestId).toBeNull()
  })

  test('should save settlement with paymentRequestId of null when paymentRequest has a status of "In progress"', async () => {
    const paymentRequestToRemove = await db.paymentRequest.findOne({ where: x => x.paymentRequestId === 1 })
    await paymentRequestToRemove.destroy()
    await db.paymentRequest.create(processingPaymentRequest)

    await processReturnSettlement(settlement)

    const result = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
    expect(result.paymentRequestId).toBeNull()
  })

  test('should save entry into schedule table if first payment settlement', async () => {
    await processReturnSettlement(settlement)

    const result = await db.schedule.count()
    expect(result).toBe(1)
  })

  test('should not save entry into settlement table if not first payment settlement', async () => {
    settlement.invoiceNumber = 'S0000001SFIP000001V002'
    await processReturnSettlement(settlement)

    const result = await db.schedule.count()
    expect(result).toBe(0)
  })
})
