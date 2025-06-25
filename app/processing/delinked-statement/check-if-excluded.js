const checkIfExcluded = async (dax) => {
  const excluded = await db.delinkedExclusion.findOne({
    attributes: [
      'frn',
      'marketingYear'
    ],
    where: {
      frn: dax.frn,
      marketingYear: dax.marketingYear
    },
    raw: true
  })
  return !!excluded 
}

module.exports = checkIfExcluded
