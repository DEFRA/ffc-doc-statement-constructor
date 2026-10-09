const { dax } = require('../../database')

const updateDaxStartPublishByDaxId = async (daxId, started, transaction) => {
  await dax(transaction)
    .where({ daxId })
    .update({ startPublish: started, lastProcessAttempt: started })
}

module.exports = updateDaxStartPublishByDaxId
