const ytdl = require('ytdl-core');
const {guilds} = require('../db');
const Discord = require('discord.js');
const vMap = new Discord.Collection([
  ['mi', 'https://www.youtube.com/watch?v=XAYhNHhxN0A']
]);

module.exports = {
  name: 'voice',
  description: 'plays random sounds you may need',
  usage: '<sound>',
  aliases: ['vc'],
  args: true,
  guildOnly: true,
  execute: async (msg, args) => {
    if (!vMap.has(args[0])) return msg.channel.send(`That is not a valid sound, here is a list of some:\n\`${vMap.keyArray().join(', ')}\``);
    const vconn = msg.guild.voiceConnection;
    if (vconn) vconn.disconnect();
    const vc = msg.member.voiceChannel;
    if (vc) {
      const {volume} = await guilds.findOne({where: {guildId: msg.guild.id}});
      const conn = await vc.join();
      const stream = ytdl(vMap.get(args[0]), {filter: 'audioonly'});
      const dispatcher = conn.playStream(stream);
      dispatcher.setVolume(volume/100);
      dispatcher.once('end', () => vc.leave());
    }
    else msg.channel.send('You are not in any voice channel');
  }
};