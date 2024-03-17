const db = require('../../data')

const updateDaxStartPublishByDaxId = async (daxId, started, transaction) => {
  await db.dax.update({ startPublish: started, lastProcessAttempt: started }, {
    transaction,
    where: {
      daxId
    }
  })
}

module.exports = updateDaxStartPublishByDaxId
