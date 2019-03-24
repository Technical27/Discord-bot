const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  operatorsAliases: false,
  storage: 'db.sqlite',
});

const shop = sequelize.import('dbModels/shop');
sequelize.import('dbModels/items');
sequelize.import('dbModels/users');
sequelize.import('dbModels/guilds');

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({force}).then(async () => {
  await Promise.all([
    shop.upsert({name: 'idk', cost: 100})
  ]);
  console.log('Database synced');
  sequelize.close();
}).catch(console.error);