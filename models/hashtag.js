module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Hashtag',
    {
      title: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
      },
    },
    {
      // Other model options go here
      timestamps: true,
      paranoid: false,
      underscored: false,
    }
  );
};
