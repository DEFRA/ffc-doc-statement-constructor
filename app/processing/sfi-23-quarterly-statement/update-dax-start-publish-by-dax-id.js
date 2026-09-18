const { dax } = require('../../data')

const updateDaxStartPublishByDaxId = async (daxId, started, transaction) => {
  await dax(transaction)
    .where({ daxId })
    .update({ startPublish: started, lastProcessAttempt: started })
}

module.exports = updateDaxStartPublishByDaxId
