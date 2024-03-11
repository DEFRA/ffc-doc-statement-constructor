module.exports = (sequelize, DataTypes) => {
  const number30 = 30
  const number200 = 200
  const dax = sequelize.define('dax', {
    paymentReference: { type: DataTypes.STRING(number30), primaryKey: true, allowNull: false },
    calculationId: { type: DataTypes.INTEGER },
    paymentPeriod: { type: DataTypes.STRING(number200), allowNull: false },
    paymentAmount: { type: DataTypes.NUMERIC, allowNull: false },
    transactionDate: { type: DataTypes.TIMESTAMP, allowNull: false },
    datePublished: { type: DataTypes.TIMESTAMP, allowNull: true }
  },
  {
    tableName: 'dax',
    freezeTableName: true,
    timestamps: false
  })
  dax.associate = function (models) {
    dax.belongsTo(models.dax, {
      foreignKey: 'calculationId',
      as: 'daxEntries'
    })
  }
  return dax
}
