const db = require('../../data')

const resetD365UnCompletePublishByDaxId = async (d365Id) => {
  await db.d365.update({ startPublish: null }, {
    where: {
      d365Id,
      completePublish: null
    }
  })
}

module.exports = resetD365UnCompletePublishByDaxId
