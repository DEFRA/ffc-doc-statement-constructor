module.exports = (sequelize, DataTypes) => {
  const documentStatus = sequelize.define('document', {
    documentId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    documentTypeId: DataTypes.INTEGER,
    documentSourceReference: DataTypes.STRING
  },
  {
    tableName: 'documents',
    freezeTableName: true,
    timestamps: false
  })
  documentStatus.associate = function (models) {
    documentStatus.belongsTo(models.documentType, {
      foreignKey: 'documentTypeId',
      as: 'documentTypes'
    })
  }
  return documentStatus
}
