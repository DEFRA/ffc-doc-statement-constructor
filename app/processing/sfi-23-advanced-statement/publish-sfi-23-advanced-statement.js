const util = require('util')

const config = require('../../config')
const sendMessage = require('../../messaging/send-message')

const publishSfi23AdvancedStatement = async (sfi23AdvancedStatement) => {
  await sendMessage(sfi23AdvancedStatement, 'uk.gov.doc.sfi-23-advanced-statement', config.statementTopic)
  console.log('SFI23 Advanced Statement sent:', util.inspect(sfi23AdvancedStatement, false, null, true))
}

module.exports = publishSfi23AdvancedStatement
