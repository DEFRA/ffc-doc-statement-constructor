module.exports = (sequelize, DataTypes) => {
  const delinkedExclusion = sequelize.define('delinkedExclusion', {
    exclusionId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    frn: DataTypes.BIGINT,
    marketingYear: DataTypes.INTEGER
  },
  {
    tableName: 'delinkedExclusions',
    freezeTableName: true,
    timestamps: false
  })
  return delinkedExclusion
}
