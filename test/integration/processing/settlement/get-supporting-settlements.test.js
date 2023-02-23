const db = require('../../../../app/data')

const { getSupportingSettlements } = require('../../../../app/processing/settlement')
const invoiceNumbers = require('../../../mock-components/mock-invoice-number')
const { SFI: SFI_AGREEMENT_NUMBER } = require('../../../mock-components/mock-agreement-number')
const MARKETING_YEAR = require('../../../mock-components/mock-marketing-year')
const { DATE: SETTLEMENT_DATE } = require('../../../mock-components/mock-dates').SETTLEMENT
const schemes = require('../../../../app/constants/schemes')

let settlementDate
let agreementNumber
let marketingYear

let paymentRequest
let topUpPaymentRequest
let downwardAdjustmentPaymentRequest
let splitPaymentRequestA

let settlement

describe('get supporting settlements', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    paymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').submitPaymentRequest))
    topUpPaymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').topUpSubmitPaymentRequest))
    downwardAdjustmentPaymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').downwardAdjustmentSubmitPaymentRequest))
    splitPaymentRequestA = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').splitSubmitPaymentRequestA))

    settlement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-settlement')))
    settlement.settlementDate = SETTLEMENT_DATE

    settlementDate = SETTLEMENT_DATE
    agreementNumber = SFI_AGREEMENT_NUMBER
    marketingYear = MARKETING_YEAR

    await db.scheme.bulkCreate(schemes)
    await db.settlement.create(settlement)

    delete paymentRequest.paymentRequestId
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

  test('should return empty array if no completed payment requests', async () => {
    const settlements = await getSupportingSettlements(settlementDate, agreementNumber, marketingYear)
    expect(settlements).toHaveLength(0)
  })

  test('should return empty array if only completed is first payment', async () => {
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_FIRST_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_FIRST_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(paymentRequest)
    const settlements = await getSupportingSettlements(settlementDate, agreementNumber, marketingYear)
    expect(settlements).toHaveLength(0)
  })

  test('should return empty array if top up has no settlement', async () => {
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_FIRST_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_FIRST_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(topUpPaymentRequest)
    const result = await getSupportingSettlements(settlementDate, agreementNumber, marketingYear)
    await expect(result).toHaveLength(0)
  })

  test('should return empty array if downward adjustment has no settlement', async () => {
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_FIRST_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_FIRST_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(downwardAdjustmentPaymentRequest)
    const result = await getSupportingSettlements(settlementDate, agreementNumber, marketingYear)
    await expect(result).toHaveLength(0)
  })

  test('should return empty array if split payment has no settlement', async () => {
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_FIRST_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_FIRST_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SPLIT_A, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(splitPaymentRequestA)
    const result = await getSupportingSettlements(settlementDate, agreementNumber, marketingYear)
    await expect(result).toHaveLength(0)
  })

  test('should return top up settlement if top up has settlement', async () => {
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_FIRST_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_FIRST_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(topUpPaymentRequest)
    settlement.invoiceNumber = invoiceNumbers.SFI_SECOND_PAYMENT
    await db.settlement.create(settlement)
    const settlements = await getSupportingSettlements(settlementDate, agreementNumber, marketingYear)
    expect(settlements).toHaveLength(1)
  })

  test('should return downward adjustment settlement if downward adjustment has settlement', async () => {
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_FIRST_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_FIRST_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(downwardAdjustmentPaymentRequest)
    settlement.invoiceNumber = invoiceNumbers.SFI_SECOND_PAYMENT
    await db.settlement.create(settlement)
    const settlements = await getSupportingSettlements(settlementDate, agreementNumber, marketingYear)
    expect(settlements).toHaveLength(1)
  })

  test('should return split payment settlement if split payment has settlement', async () => {
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_FIRST_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_FIRST_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SPLIT_A, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(splitPaymentRequestA)
    settlement.invoiceNumber = invoiceNumbers.SFI_SPLIT_A
    await db.settlement.create(settlement)
    const settlements = await getSupportingSettlements(settlementDate, agreementNumber, marketingYear)
    expect(settlements).toHaveLength(1)
  })

  test('should return top up and downward adjustment settlements if both have settlements', async () => {
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_FIRST_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_FIRST_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(topUpPaymentRequest)
    settlement.invoiceNumber = invoiceNumbers.SFI_SECOND_PAYMENT
    await db.settlement.create(settlement)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_THIRD_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_THIRD_PAYMENT_ORIGINAL })
    downwardAdjustmentPaymentRequest.invoiceNumber = invoiceNumbers.SFI_THIRD_PAYMENT
    await db.paymentRequest.create(downwardAdjustmentPaymentRequest)
    settlement.invoiceNumber = invoiceNumbers.SFI_THIRD_PAYMENT
    await db.settlement.create(settlement)
    const settlements = await getSupportingSettlements(settlementDate, agreementNumber, marketingYear)
    expect(settlements).toHaveLength(2)
  })

  test('should return top up and split payment settlements if both have settlements', async () => {
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_FIRST_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_FIRST_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(topUpPaymentRequest)
    settlement.invoiceNumber = invoiceNumbers.SFI_SECOND_PAYMENT
    await db.settlement.create(settlement)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SPLIT_THIRD_A, originalInvoiceNumber: invoiceNumbers.SFI_THIRD_PAYMENT_ORIGINAL })
    splitPaymentRequestA.invoiceNumber = invoiceNumbers.SFI_SPLIT_THIRD_A
    await db.paymentRequest.create(splitPaymentRequestA)
    settlement.invoiceNumber = invoiceNumbers.SFI_SPLIT_THIRD_A
    await db.settlement.create(settlement)
    const settlements = await getSupportingSettlements(settlementDate, agreementNumber, marketingYear)
    expect(settlements).toHaveLength(2)
  })

  test('should return downward adjustment and split payment settlements if both have settlements', async () => {
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_FIRST_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_FIRST_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_SECOND_PAYMENT_ORIGINAL })
    await db.paymentRequest.create(downwardAdjustmentPaymentRequest)
    settlement.invoiceNumber = invoiceNumbers.SFI_SECOND_PAYMENT
    await db.settlement.create(settlement)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_SPLIT_THIRD_A, originalInvoiceNumber: invoiceNumbers.SFI_THIRD_PAYMENT_ORIGINAL })
    splitPaymentRequestA.invoiceNumber = invoiceNumbers.SFI_SPLIT_THIRD_A
    await db.paymentRequest.create(splitPaymentRequestA)
    settlement.invoiceNumber = invoiceNumbers.SFI_SPLIT_THIRD_A
    await db.settlement.create(settlement)
    const settlements = await getSupportingSettlements(settlementDate, agreementNumber, marketingYear)
    expect(settlements).toHaveLength(2)
  })
})
