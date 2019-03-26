const {shop, user} = require('../db');
const {Op} = require('sequelize');

module.exports = {
  name: 'shop',
  description: 'lists the shop/buy items from the shop',
  usage: '<buy|list> <item?>',
  execute: async (msg, args) => {
    if (args[0] !== 'buy' && args[0] !== 'list') return msg.channel.send('you must include `buy` or `list` as an argument');
    if (args[0] === 'buy') {
      const item = await shop.findOne({where: {name: {[Op.like]: args[1]}}});
      if (!item) return msg.channel.send('that item does not exist');
      const authorBalance = msg.client.currency.getBalance(msg.author.id);
      if (item.cost > authorBalance) return msg.channel.send(`your balance is \`${authorBalance}\`, but the item costs \`${item.cost}\``);
      const targetUser = await user.findByPrimary(msg.author.id);
      msg.client.currency.add(msg.author.id, -item.cost);
      await targetUser.addItem(item);
      msg.channel.send(`You just bought ${item.name}`);
    }
    else if (args[0] === 'list') {
      const items = await shop.findAll();
      msg.channel.send(items.map(item => `${item.name}: ${item.cost}`).join('\n'));
    }
  }
};