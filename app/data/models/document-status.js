module.exports = (sequelize, DataTypes) => {
  const documentStatus = sequelize.define('documentStatus', {
    documentStatusId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    documentTypeId: DataTypes.INTEGER,
    schemeId: DataTypes.INTEGER,
    marketingYear: DataTypes.INTEGER,
    isCurrent: DataTypes.BOOLEAN,
    isActive: DataTypes.BOOLEAN,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE
  },
  {
    tableName: 'documentStatuses',
    freezeTableName: true,
    timestamps: false
  })
  documentStatus.associate = function (models) {
    documentStatus.belongsTo(models.scheme, {
      foreignKey: 'schemeId',
      as: 'schemes'
    })
    documentStatus.belongsTo(models.documentType, {
      foreignKey: 'documentTypeId',
      as: 'documentTypes'
    })
  }
  return documentStatus
}
