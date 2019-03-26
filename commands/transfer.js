module.exports = {
  name: 'transfer',
  description: 'transfers money to a different user',
  usage: '<user> <amount>',
  execute: (msg, args) => {
    const mention = msg.client.mention;
    const amount = Number(args.find(arg => !mention.test(arg)));
    let target = args.find(arg => mention.test(arg));
    if (!target) return msg.channel.send('no target user was found');
    if (isNaN(amount) || amount < 1) return msg.channel.send('invalid amount to transfer');
    [,target] = target.match(mention);
    const targetUser = msg.client.users.get(target);
    msg.client.currency.add(target, amount);
    msg.client.currency.add(msg.author.id, -amount);
    msg.channel.send(`Transfered ${amount} from ${msg.author.username} to ${targetUser.username}`);
  }
};