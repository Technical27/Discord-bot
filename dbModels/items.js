module.exports = (sequelize, dt) => {
  return sequelize.define('userItem', {
    user_id: dt.STRING,
    item_id: dt.STRING,
    amount: {
      type: dt.INTEGER.UNSIGNED,
      allowNull: false,
      default: 0,
    },
  }, {
    timestamps: false,
  });
};