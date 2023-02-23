const db = require('../../../../app/data')

const getCalculation = require('../../../../app/processing/calculation')

let paymentRequest
let calculation
let retrievedCalculation

describe('process get calculation object', () => {
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
    const organisation = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-organisation')))

    calculation = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-calculation')))
    paymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').submitPaymentRequest))

    await db.scheme.bulkCreate(schemes)
    await db.organisation.create(organisation)
    await db.invoiceNumber.create({ invoiceNumber, originalInvoiceNumber })
    await db.paymentRequest.create(paymentRequest)

    retrievedCalculation = {
      calculationId: 1,
      paymentRequestId: paymentRequest.paymentRequestId,
      sbi: calculation.sbi,
      calculated: new Date(calculation.calculationDate),
      invoiceNumber: calculation.invoiceNumber
    }
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

  test('should throw error when no existing calculation data', async () => {
    const wrapper = async () => { await getCalculation(paymentRequest.paymentRequestId, paymentRequest.invoiceNumber) }

    expect(wrapper).rejects.toThrow()
  })

  test('should not throw error when there is existing calculation data with sbi, calculationId, invoiceNumber, calculationDate and paymentRequestId', async () => {
    await db.calculation.create({ ...calculation, paymentRequestId: paymentRequest.paymentRequestId })
    const result = await getCalculation(paymentRequest.paymentRequestId, paymentRequest.invoiceNumber)
    expect(result).toStrictEqual(retrievedCalculation)
  })

  test('should throw error when there is existing calculation data with sbi but no calculationDate', async () => {
    delete calculation.calculationDate
    await db.calculation.create({ ...calculation, paymentRequestId: paymentRequest.paymentRequestId })

    const wrapper = async () => { await getCalculation(paymentRequest.paymentRequestId, paymentRequest.invoiceNumber) }

    expect(wrapper).rejects.toThrow()
  })
})
