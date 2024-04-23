const db = require('../../data')

const updateDaxCompletePublishByDaxId = async (daxId) => {
  await db.dax.update({ completePublish: new Date() }, {
    where: {
      daxId
    }
  })
}

module.exports = updateDaxCompletePublishByDaxId
