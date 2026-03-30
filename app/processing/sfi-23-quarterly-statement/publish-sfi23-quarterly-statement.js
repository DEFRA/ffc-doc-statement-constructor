const config = require('../../config')
const sendMessage = require('../../messaging/send-message')

const publishSfi23QuarterlyStatement = async (sfi23QuarterlyStatement) => {
  await sendMessage(sfi23QuarterlyStatement, 'uk.gov.doc.sfi-23-quarterly-statement', config.statementTopic)
  console.log(`Sfi-23 Quarterly Statement sent: sbi: ${sfi23QuarterlyStatement.sbi}, frn: ${sfi23QuarterlyStatement.frn}`)
}

module.exports = publishSfi23QuarterlyStatement
