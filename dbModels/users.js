module.exports = (sequalize, dt) => {
  return sequalize.define('users', {
    user_id: {
      type: dt.STRING,
      primaryKey: true
    },
    balance: {
      type: dt.INTEGER.UNSIGNED,
      defaultValue: 0,
      allowNull: false
    }
  }, {timestamps: false});
};