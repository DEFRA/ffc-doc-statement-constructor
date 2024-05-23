const util = require('util')

const config = require('../../config')
const sendMessage = require('../../messaging/send-message')
const saveRptUnequalTotalPayment = require('./save-rpt-unequal-total-payment')

const publishSfi23QuarterlyStatement = async (sfi23QuarterlyStatement) => {
  const paymentAmountValue = new Intl.NumberFormat().format(Number(sfi23QuarterlyStatement.paymentAmount)).toString()
  const totalPaymentsValue = new Intl.NumberFormat().format(Number(sfi23QuarterlyStatement.totalPayments)).toString()
  if (paymentAmountValue !== totalPaymentsValue) {
    const unequalTotalPayment = {
      paymentReference: sfi23QuarterlyStatement.paymentReference,
      calculationId: sfi23QuarterlyStatement.calculationId,
      paymentPeriod: sfi23QuarterlyStatement.paymentPeriod,
      expectedQuarterlyPayment: totalPaymentsValue,
      actualQuarterlyPayment: paymentAmountValue,
      transactionDate: sfi23QuarterlyStatement.transactionDate,
      sbi: sfi23QuarterlyStatement.sbi,
      frn: sfi23QuarterlyStatement.frn,
      schemeName: sfi23QuarterlyStatement.scheme.name
    }

    await saveRptUnequalTotalPayment(unequalTotalPayment)
  }
  await sendMessage(sfi23QuarterlyStatement, 'uk.gov.doc.sfi-23-quarterly-statement', config.statementTopic)
  console.log('Sfi-23 Quarterly Statement sent:', util.inspect(sfi23QuarterlyStatement, false, null, true))
}

module.exports = publishSfi23QuarterlyStatement
