module.exports = (sequelize, DataTypes) => {
  const documentType = sequelize.define('documentType', {
    documentTypeId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.STRING
  },
  {
    tableName: 'documentTypes',
    freezeTableName: true,
    timestamps: false
  })
  documentType.associate = function (models) {
    documentType.hasMany(models.documentStatus, {
      foreignKey: 'documentTypeId',
      as: 'documentStatuses'
    })
  }
  return documentType
}
