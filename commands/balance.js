module.exports = {
  name: 'balance',
  description: 'shows the balance for you or any user',
  usage: '<user?>',
  execute: async (msg, args) => {
    const mention = msg.client.mention;
    let target = args.find(arg => mention.test(arg));
    target ? [,target] = target.match(mention) : target = msg.author.id;
    const balance = await msg.client.currency.getBalance(target);
    if (msg.author.id == target) msg.channel.send(`your balance is \`${balance}\``);
    else msg.channel.send(`${msg.client.users.get(target).username}'s balance is \`${balance}\``);
  }
};