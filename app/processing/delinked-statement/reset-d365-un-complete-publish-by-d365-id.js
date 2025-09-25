const db = require('../../data')
const { dataProcessingAlert } = require('ffc-alerting-utils')
const { DATA_PROCESSING_ERROR } = require('../../../app/constants/alerts')

const resetD365UnCompletePublishByDaxId = async (d365Id) => {
  try {
    await db.d365.update({ startPublish: null }, {
      where: {
        d365Id,
        completePublish: null
      }
    })
  } catch (err) {
    try {
      await dataProcessingAlert({
        process: 'resetD365UnCompletePublishByDaxId',
        d365Id,
        error: err,
        message: `Error resetting uncomplete publish for D365 ID ${d365Id}`
      }, DATA_PROCESSING_ERROR)
    } catch (alertErr) {
      console.error(`Error resetting uncomplete publish for D365 ID ${d365Id}: ${err.message}`,
        { originalError: err, alertError: alertErr }
      )
    }
    throw new Error(`Error resetting uncomplete publish for D365 ID ${d365Id}: ${err.message}`,
      { cause: err }
    )
  }
}

module.exports = resetD365UnCompletePublishByDaxId
