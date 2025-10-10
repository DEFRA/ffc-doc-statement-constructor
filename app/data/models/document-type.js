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
  return documentType
}
