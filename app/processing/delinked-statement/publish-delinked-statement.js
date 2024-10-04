const util = require('util')
const getEmailAddress = require('./get-email-from-delinked')
const getPrintStatus = require('./get-print-status')

const config = require('../../config')
const sendMessage = require('../../messaging/send-message')
const { then } = require('../..')

if (getEmailAddress == null) {
  console.log('getEmailAddress is not found')
  then(getPrintStatus.startPublish, getPrintStatus.lastProcessAttempt, getPrintStatus.completePublish, getPrintStatus.transaction)
}

const publishSfi23QuarterlyStatement = async (sfi23QuarterlyStatement) => {
  await sendMessage(sfi23QuarterlyStatement, 'uk.gov.doc.sfi-23-quarterly-statement', config.statementTopic)
  console.log('Sfi-23 Quarterly Statement sent:', util.inspect(sfi23QuarterlyStatement, false, null, true))
}

module.exports = publishSfi23QuarterlyStatement
