module.exports = (sequelize, dt) => {
  return sequelize.define('guilds', {
    guildId: {
      unique: true,
      type: dt.STRING,
      allowNull: false,
      primaryKey: true
    },
    prefix: {
      type: dt.STRING,
      allowNull: false,
      defaultValue: '$$'
    },
    volume: {
      type: dt.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 100
    }
  }, {timestamps: false});
};