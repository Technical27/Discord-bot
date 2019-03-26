const {guild} = require('../db');

module.exports = {
  name: 'volume',
  description: 'sets the volume for all voice commands',
  cooldown: 3,
  usage: '<new volume>',
  execute: (msg, args) => {
    const volume = Math.max(Math.min(Number(args[0]), 100), 0);
    if (isNaN(volume)) return msg.channel.send('That is an invalid volume');
    guild.update({volume}, {where: {guildId: msg.guild.id}});
    msg.channel.send(`your volume is now \`${volume}\``);
  }
};