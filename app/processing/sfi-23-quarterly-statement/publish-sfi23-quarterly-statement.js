const util = require('util')

const config = require('../../config')
const sendMessage = require('../../messaging/send-message')

const publishSfi23QuarterlyStatement = async (sfi23QuarterlyStatement) => {
  await sendMessage(sfi23QuarterlyStatement, 'uk.gov.doc.sfi-23-quarterly-statement', config.statementTopic)
  console.log('Sfi-23 Quarterly Statement sent:', util.inspect(sfi23QuarterlyStatement, false, null, true))
}

module.exports = publishSfi23QuarterlyStatement
