const {owner} = require('../config.json');

module.exports = {
  name: 'mint',
  hidden: true,
  execute: async (msg, args) => {
    const mention = msg.client.mention;
    if (msg.author.id !== owner) return;
    const amount = args.find(arg => !mention.test(arg));
    let target = args.find(arg => mention.test(arg));
    target ? [,target] = target.match(mention) : target = msg.author.id;
    const targetUser = msg.client.users.get(target);
    msg.client.currency.add(target, amount);
    msg.channel.send(`Added ${amount} to ${targetUser.username}`);
  }
};