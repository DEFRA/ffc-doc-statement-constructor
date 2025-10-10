module.exports = (sequelize, DataTypes) => {
  const scheme = sequelize.define('scheme', {
    schemeId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    code: { type: DataTypes.STRING, allowNull: false }
  },
  {
    tableName: 'schemes',
    freezeTableName: true,
    timestamps: false
  })
  return scheme
}
