module.exports = (sequelize, DataTypes) => {
  const zeroValue = 0
  const maxFRN = 16
  const maxSBI = 38

  const commonStringField = { type: DataTypes.STRING, allowNull: false }

  const delinkedCalculation = sequelize.define('delinkedCalculation', {
    calculationReference: { type: DataTypes.INTEGER(), primaryKey: true, allowNull: false },
    applicationReference: { type: DataTypes.INTEGER(), allowNull: false },
    sbi: { type: DataTypes.NUMBER(maxSBI, zeroValue), allowNull: false },
    frn: { type: DataTypes.STRING(maxFRN), allowNull: false },
    ...Array.from({ length: 4 }, (_, i) => ({
      [`paymentBand${i + 1}`]: commonStringField,
      [`percentageReduction${i + 1}`]: commonStringField,
      [`progressiveReductions${i + 1}`]: commonStringField
    })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
    referenceAmount: commonStringField,
    totalProgressiveReduction: commonStringField,
    totalDelinkedPayment: commonStringField,
    paymentAmountCalculated: commonStringField,
    datePublished: { type: DataTypes.DATE, allowNull: false },
    updated: { type: DataTypes.DATE, allowNull: false }
  },
  {
    tableName: 'delinkedCalculation',
    freezeTableName: true,
    timestamps: false
  })

  delinkedCalculation.associate = function (models) {
    delinkedCalculation.hasMany(models.d365, {
      foreignKey: 'calculationId',
      as: 'delinkedCalculation'
    })
    delinkedCalculation.belongsTo(models.organisation, {
      foreignKey: 'sbi',
      as: 'organisations'
    })
  }

  return delinkedCalculation
}
