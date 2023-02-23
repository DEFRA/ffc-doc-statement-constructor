const util = require('util')

const config = require('../../config')
const sendMessage = require('../../messaging/send-message')

const publishStatement = async (statement) => {
  await sendMessage(statement, 'uk.gov.pay.statement', config.statementTopic)
  console.log('Statement sent:', util.inspect(statement, false, null, true))
}

module.exports = publishStatement
