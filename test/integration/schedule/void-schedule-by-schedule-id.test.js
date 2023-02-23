const db = require('../../../app/data')
const voidSchedule = require('../../../app/processing/schedule/void-scheduled-by-schedule-id')
let savedSchedule
let voided

describe('void schedule', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
    const schemes = require('../../../app/constants/schemes')
    const invoiceNumbers = require('../../mock-components/mock-invoice-number')
    const { submitPaymentRequest } = require('../../mock-objects/mock-payment-request')
    const schedule = JSON.parse(JSON.stringify(require('../../mock-objects/mock-schedule').STATEMENT))
    await db.scheme.bulkCreate(schemes)
    await db.invoiceNumber.create({ invoiceNumber: invoiceNumbers.SFI_FIRST_PAYMENT, originalInvoiceNumber: invoiceNumbers.SFI_FIRST_PAYMENT_ORIGINAL })
    const savedPaymentRequest = await db.paymentRequest.create(submitPaymentRequest)
    schedule.settlementId = null
    schedule.paymentRequestId = savedPaymentRequest.paymentRequestId
    savedSchedule = await db.schedule.create(schedule)
    voided = new Date()
  })

  test('should set date voided', async () => {
    await voidSchedule(savedSchedule.scheduleId, voided)
    const result = await db.schedule.findByPk(savedSchedule.scheduleId)
    expect(result.voided).not.toBeNull()
  })

  test('should set date voided to equal date passed', async () => {
    await voidSchedule(savedSchedule.scheduleId, voided)
    const result = await db.schedule.findByPk(savedSchedule.scheduleId)
    expect(result.voided).toStrictEqual(voided)
  })
})
