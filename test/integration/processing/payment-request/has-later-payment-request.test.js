const db = require('../../../../app/data')
const hasLaterPaymentRequest = require('../../../../app/processing/payment-request/has-later-payment-request')
const { POST_PAYMENT_ADJUSTMENT: POST_PAYMENT_ADJUSTMENT_PAYMENT_REQUEST_NUMBER } = require('../../../../app/constants/payment-request-numbers')

let invoiceNumbers
let processingPaymentRequest
let submitPaymentRequest

describe('has later payment request', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
    const schemes = JSON.parse(JSON.stringify(require('../../../../app/constants/schemes')))
    invoiceNumbers = JSON.parse(JSON.stringify(require('../../../mock-components/mock-invoice-number')))
    const paymentRequests = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request')))

    await db.scheme.bulkCreate(schemes)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_FIRST_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_FIRST_PAYMENT_ORIGINAL })

    processingPaymentRequest = paymentRequests.processingPaymentRequest
    submitPaymentRequest = paymentRequests.submitPaymentRequest

    delete processingPaymentRequest.paymentRequestId
    delete submitPaymentRequest.paymentRequestId
  })

  test('returns true if there is a later in progress payment request', async () => {
    const firstPaymentRequest = await db.paymentRequest.create(processingPaymentRequest)
    processingPaymentRequest.paymentRequestNumber = POST_PAYMENT_ADJUSTMENT_PAYMENT_REQUEST_NUMBER
    await db.paymentRequest.create(processingPaymentRequest)
    const result = await hasLaterPaymentRequest(firstPaymentRequest.paymentRequestId)
    expect(result).toBe(true)
  })

  test('returns true if there is a later submitted payment request', async () => {
    const firstPaymentRequest = await db.paymentRequest.create(processingPaymentRequest)
    submitPaymentRequest.paymentRequestNumber = POST_PAYMENT_ADJUSTMENT_PAYMENT_REQUEST_NUMBER
    await db.paymentRequest.create(submitPaymentRequest)
    const result = await hasLaterPaymentRequest(firstPaymentRequest.paymentRequestId)
    expect(result).toBe(true)
  })

  test('returns false if there is no later payment request', async () => {
    const firstPaymentRequest = await db.paymentRequest.create(processingPaymentRequest)
    const result = await hasLaterPaymentRequest(firstPaymentRequest.paymentRequestId)
    expect(result).toBe(false)
  })
})
