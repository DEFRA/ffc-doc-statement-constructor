const util = require('util')

const config = require('../../config')
const sendMessage = require('../../messaging/send-message')

const publishDelinkedStatement = async (delinkedStatement) => {
  await sendMessage(delinkedStatement, 'uk.gov.doc.delinked-statement', config.statementTopic)
  console.log('Delinked Payment Statement sent:', util.inspect(delinkedStatement, false, null, true))
}

module.exports = publishDelinkedStatement
