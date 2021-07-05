module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Post',
    {
      // Post와 User의 관계는 알아서 생성해준다.
      contents: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      img: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
    },
    {
      // Other model options go here
      timestamps: true,
      paranoid: true,
      underscored: false,
    }
  );
};
