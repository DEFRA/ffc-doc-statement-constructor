const { DELINKED } = require('../../constants/types')

module.exports = (sequelize, DataTypes) => {
  const scale0 = 0
  const precision11 = 11
  const maxFRN = 16
  const maxSBI = 38

  const commonStringField = { type: DataTypes.STRING, allowNull: false }

  const delinkedCalculation = sequelize.define('delinkedCalculation', {
    applicationReference: { type: DataTypes.NUMBER(precision11, scale0), allowNull: false },
    calculationReference: { type: DataTypes.NUMBER(precision11, scale0), primaryKey: true, allowNull: false },
    sbi: { type: DataTypes.NUMBER(maxSBI, scale0), allowNull: false },
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
    updated: { type: DataTypes.DATE, allowNull: false },
    type: DELINKED
  },
  {
    tableName: 'delinkedCalculation',
    freezeTableName: true,
    timestamps: false
  })

  delinkedCalculation.associate = function (models) {
    delinkedCalculation.hasMany(models.dax, {
      foreignKey: 'calculationId',
      as: 'daxEntries'
    })
    delinkedCalculation.belongsTo(models.organisation, {
      foreignKey: 'sbi',
      as: 'organisations'
    })
  }

  return delinkedCalculation
}
