module.exports = (sequelize, dt) => {
  return sequelize.define('shop', {
    name: {
      type: dt.STRING,
      unique: true,
    },
    cost: {
      type: dt.INTEGER.UNSIGNED,
      allowNull: false,
    },
  }, {timestamps: false});
};