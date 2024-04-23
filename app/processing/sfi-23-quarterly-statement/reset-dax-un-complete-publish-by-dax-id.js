const db = require('../../data')

const resetDaxUnCompletePublishByDaxId = async (daxId) => {
  await db.dax.update({ startPublish: null }, {
    where: {
      daxId,
      completePublish: null
    }
  })
}

module.exports = resetDaxUnCompletePublishByDaxId
