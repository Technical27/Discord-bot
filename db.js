const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'db.sqlite',
  operatorsAliases: false
});

const users = sequelize.import('dbModels/users');
const shop = sequelize.import('dbModels/shop');
const item = sequelize.import('dbModels/items');
const guilds = sequelize.import('dbModels/guilds');

item.belongsTo(shop, {foreignKey: 'item_id', as: 'item'});

users.prototype.addItem = async item => {
  const userItem = await item.findOne({
    where: { user_id: this.user_id, item_id: item.id },
  });
  if (userItem) {
    userItem.amount += 1;
    return userItem.save();
  }
  return item.create({user_id: this.user_id, item_id: item.id, amount: 1});
};

users.prototype.getItem = () => {
  return item.findAll({
    where: {user_id: this.user_id},
    include: ['item'],
  });
};

module.exports = {users, shop, item, guilds};