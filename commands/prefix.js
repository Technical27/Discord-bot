const {guild} = require('../db');

module.exports = {
  name: 'prefix',
  description: 'updates the prefix the bot will use for your server',
  usage: '<new prefix>',
  cooldown: 3,
  args: true,
  execute: async (msg, args) => {
    await guild.update({prefix: args[0]}, {
      where: {guild_id: msg.guild.id}
    });
    msg.channel.send(`your prefix is now: \`${args[0]}\``);
  }
};