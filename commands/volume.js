const {guild} = require('../db');

module.exports = {
  name: 'volume',
  description: 'sets the volume for all voice commands',
  cooldown: 3,
  usage: '<new volume>',
  execute: (msg, args) => {
    if (isNaN(args[0])) return msg.channel.send('That is an invalid volume');
    const volume = Math.max(Math.min(args[0], 100), 0);
    guild.update({volume}, {where: {guild_id: msg.guild.id}});
    msg.channel.send(`your volume is now \`${volume}\``);
  }
};