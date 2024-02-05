module.exports = (sequelize, DataTypes) => {
  const scheme = sequelize.define('scheme', {
    schemeId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING
  },
  {
    tableName: 'schemes',
    freezeTableName: true,
    timestamps: false
  })
  scheme.associate = function (models) {
    scheme.hasMany(models.paymentRequest, {
      foreignKey: 'schemeId',
      as: 'paymentRequests'
    })
    scheme.hasMany(models.documentStatus, {
      foreignKey: 'schemeId',
      as: 'documentStatuses'
    })
  }
  return scheme
}
