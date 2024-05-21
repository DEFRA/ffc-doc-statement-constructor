const publishSfi23QuarterlyStatement = require('../../../../app/processing/sfi-23-quarterly-statement/publish-sfi23-quarterly-statement')

const util = require('util')

const config = require('../../../../app/config')

jest.mock('../../../../app/messaging/send-message')
const sendMessage = require('../../../../app/messaging/send-message')

jest.mock('../../../../app/processing/sfi-23-quarterly-statement/save-rpt-unequal-total-payment')
const saveRptUnequalTotalPayment = require('../../../../app/processing/sfi-23-quarterly-statement/save-rpt-unequal-total-payment')

describe('publishSfi23QuarterlyStatement', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  test('should call sendMessage with correct parameters', async () => {
    const sfi23QuarterlyStatement = { /* mock statement object */ }

    await publishSfi23QuarterlyStatement(sfi23QuarterlyStatement)

    expect(sendMessage).toHaveBeenCalledWith(
      sfi23QuarterlyStatement,
      'uk.gov.doc.sfi-23-quarterly-statement',
      config.statementTopic
    )
  })

  test('should call saveRptUnequalTotalPayment when paymentAmount is not equal totalPayment', async () => {
    const sfi23QuarterlyStatement = { totalPayments: 100.02, paymentAmount: 100.01, scheme: { name: 'schemeName' } }

    await publishSfi23QuarterlyStatement(sfi23QuarterlyStatement)

    expect(saveRptUnequalTotalPayment).toHaveBeenCalled()
  })

  test('should not call saveRptUnequalTotalPayment when paymentAmount is equal totalPayment', async () => {
    const sfi23QuarterlyStatement = { totalPayments: 100.02, paymentAmount: 100.02, scheme: { name: 'schemeName' } }

    await publishSfi23QuarterlyStatement(sfi23QuarterlyStatement)

    expect(saveRptUnequalTotalPayment).not.toHaveBeenCalled()
  })

  test('should log the sent statement', async () => {
    const sfi23QuarterlyStatement = { /* mock statement object */ }
    const consoleLogSpy = jest.spyOn(console, 'log')
    const utilInspectSpy = jest.spyOn(util, 'inspect')

    await publishSfi23QuarterlyStatement(sfi23QuarterlyStatement)

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Sfi-23 Quarterly Statement sent:',
      utilInspectSpy(sfi23QuarterlyStatement, false, null, true)
    )
  })
})
