module.exports = (sequelize, DataTypes) => {
  const fundingOption = sequelize.define('fundingOption', {
    fundingCode: { type: DataTypes.STRING, primaryKey: true },
    name: DataTypes.STRING
  },
  {
    tableName: 'fundingOptions',
    freezeTableName: true,
    timestamps: false
  })
  fundingOption.associate = function (models) {
    fundingOption.hasMany(models.invoiceLine, {
      foreignKey: 'fundingCode',
      as: 'invoiceLines'
    })
    fundingOption.hasMany(models.funding, {
      foreignKey: 'fundingCode',
      as: 'fundings'
    })
  }
  return fundingOption
}
