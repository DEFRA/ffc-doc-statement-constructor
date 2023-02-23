const db = require('../../../../app/data')

const getInvoiceLine = require('../../../../app/processing/invoice-line/get-invoice-line')

const QUARTER = 0.25

let invoiceLines

describe('process get invoice line object', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    const schemes = JSON.parse(JSON.stringify(require('../../../../app/constants/schemes')))
    const {
      SFI_FIRST_PAYMENT: invoiceNumber,
      SFI_FIRST_PAYMENT_ORIGINAL: originalInvoiceNumber
    } = JSON.parse(JSON.stringify(require('../../../mock-components/mock-invoice-number')))
    const fundingOptions = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-funding-options')))
    const paymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').processingPaymentRequest))
    invoiceLines = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-invoice-line')))

    await db.scheme.bulkCreate(schemes)
    await db.fundingOption.bulkCreate(fundingOptions)
    await db.invoiceNumber.create({ invoiceNumber, originalInvoiceNumber })
    await db.paymentRequest.create(paymentRequest)
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

  test('should throw error when no existing invoice-line data in database', async () => {
    const fundingOptionCode = '300001'
    const paymentRequestId = 20

    const wrapper = async () => {
      await getInvoiceLine(fundingOptionCode, paymentRequestId)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw error when no existing invoice-line data in database that corresponds to the fundingCode and a paymentRequestId given', async () => {
    await db.invoiceLine.bulkCreate(invoiceLines.map(x => { return { ...x, paymentRequestId: 1 } }))
    const fundingOptionCode = '300001'
    const paymentRequestId = 20

    const wrapper = async () => {
      await getInvoiceLine(fundingOptionCode, paymentRequestId)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should return annual value to be invoiceLine value when only 1 gross value line', async () => {
    const paymentRequestId = 1
    await db.invoiceLine.bulkCreate(invoiceLines.map(x => { return { ...x, paymentRequestId } }))
    const fundingOptionCode = invoiceLines[0].fundingCode

    const result = await getInvoiceLine(fundingOptionCode, paymentRequestId)

    expect(result.annualValue).toBe(invoiceLines[0].value)
  })

  test('should return quarterly value to be invoiceLine value using Math.trunc when only 1 gross value line', async () => {
    const paymentRequestId = 1
    await db.invoiceLine.bulkCreate(invoiceLines.map(x => { return { ...x, paymentRequestId } }))
    const fundingOptionCode = invoiceLines[0].fundingCode

    const result = await getInvoiceLine(fundingOptionCode, paymentRequestId)

    expect(result.quarterlyValue).toBe(invoiceLines[0].value * QUARTER)
  })

  test('should return 0 quarterly reduction when only 1 gross value line', async () => {
    const paymentRequestId = 1
    await db.invoiceLine.bulkCreate(invoiceLines.map(x => { return { ...x, paymentRequestId } }))
    const fundingOptionCode = invoiceLines[0].fundingCode

    const result = await getInvoiceLine(fundingOptionCode, paymentRequestId)

    expect(result.quarterlyReduction).toBe(0)
  })

  test('should return quarterly payment as quarterly value when only 1 gross value line', async () => {
    const paymentRequestId = 1
    await db.invoiceLine.bulkCreate(invoiceLines.map(x => { return { ...x, paymentRequestId } }))
    const fundingOptionCode = invoiceLines[0].fundingCode

    const result = await getInvoiceLine(fundingOptionCode, paymentRequestId)

    expect(result.quarterlyPayment).toBe(result.quarterlyValue)
  })

  test('should return annual value to be invoiceLine gross value when 1 gross value and 1 penalty line', async () => {
    const paymentRequestId = 1
    await db.invoiceLine.bulkCreate(invoiceLines.map(x => { return { ...x, paymentRequestId } }))
    const fundingOptionCode = invoiceLines[1].fundingCode

    const result = await getInvoiceLine(fundingOptionCode, paymentRequestId)

    expect(result.annualValue).toBe(invoiceLines[1].value)
  })

  test('should return quarterly value to be invoiceLine value using Math.trunc when 1 gross value and 1 penalty line', async () => {
    const paymentRequestId = 1
    await db.invoiceLine.bulkCreate(invoiceLines.map(x => { return { ...x, paymentRequestId } }))
    const fundingOptionCode = invoiceLines[1].fundingCode

    const result = await getInvoiceLine(fundingOptionCode, paymentRequestId)

    expect(result.quarterlyValue).toBe(invoiceLines[1].value * QUARTER)
  })

  test('should return absolute quarterly reduction as penalty invoiceLine value using Math.trunc when 1 gross value and 1 penalty line', async () => {
    const paymentRequestId = 1
    await db.invoiceLine.bulkCreate(invoiceLines.map(x => { return { ...x, paymentRequestId } }))
    const fundingOptionCode = invoiceLines[1].fundingCode

    const result = await getInvoiceLine(fundingOptionCode, paymentRequestId)

    expect(result.quarterlyReduction).toBe(Math.abs(invoiceLines[2].value * QUARTER))
  })

  test('should return 1 reduction item for the fundingCode and a paymentRequestId given', async () => {
    const paymentRequestId = 1
    await db.invoiceLine.bulkCreate(invoiceLines.map(x => { return { ...x, paymentRequestId } }))
    const fundingOptionCode = invoiceLines[1].fundingCode

    const result = await getInvoiceLine(fundingOptionCode, paymentRequestId)

    expect(result.reductions).toHaveLength(1)
  })

  test('should return reductions reason without prefix that corresponds to the fundingCode and a paymentRequestId given', async () => {
    const paymentRequestId = 1
    await db.invoiceLine.bulkCreate(invoiceLines.map(x => { return { ...x, paymentRequestId } }))
    const fundingOptionCode = invoiceLines[1].fundingCode

    const result = await getInvoiceLine(fundingOptionCode, paymentRequestId)

    expect(result.reductions[0].reason).toBe('Over declaration penalty')
  })

  test('should return inverted reductions value that corresponds to the fundingCode and a paymentRequestId given', async () => {
    const paymentRequestId = 1
    await db.invoiceLine.bulkCreate(invoiceLines.map(x => { return { ...x, paymentRequestId } }))
    const fundingOptionCode = invoiceLines[1].fundingCode

    const result = await getInvoiceLine(fundingOptionCode, paymentRequestId)

    expect(result.reductions[0].value).toBe(3209)
  })
})
