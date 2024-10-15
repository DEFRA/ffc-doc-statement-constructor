const db = require('../../data')

const resetD365UnCompletePublishByDaxId = async (d365Id) => {
  try {
    await db.d365.update({ startPublish: null }, {
      where: {
        d365Id,
        completePublish: null
      }
    })
  } catch (err) {
    console.error(`Error resetting uncomplete publish for D365 ID ${d365Id}: ${err.message}`)
    throw err
  }
}

module.exports = resetD365UnCompletePublishByDaxId
