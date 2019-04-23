const ytdl = require('ytdl-core');
const {guilds} = require('../db');
const Discord = require('discord.js');
const sounds = new Discord.Collection([
  ['mi', 'https://www.youtube.com/watch?v=XAYhNHhxN0A']
]);

const playSound = async (msg, link) => {
  const vconn = msg.guild.voiceConnection;
  if (vconn) vconn.disconnect();
  const vc = msg.member.voiceChannel;
  if (!vc) return msg.channel.send('You are not in any voice channel');

  const {volume} = await guilds.findOne({where: {guildId: msg.guild.id}});
  const conn = await vc.join();
  setTimeout(() => {
    const stream = ytdl(link, {filter: 'audioonly', highWaterMark: 33554432});
    const dispatcher = conn.playStream(stream);
    dispatcher.setVolume(volume/100);
    dispatcher.once('end', () => vc.leave());
  }, 2000);
};

const yt = (msg, args) => {
  const link = args[1];
  if (!ytdl.validateURL(link)) return msg.channel.send('Invalid youtube link');
  playSound(msg, link);
};

const commands = new Discord.Collection([
  ['youtube', yt]
]);

module.exports = {
  name: 'voice',
  description: 'plays random sounds you may need',
  usage: '<sound>',
  aliases: ['vc'],
  args: true,
  guildOnly: true,
  execute: async (msg, args) => {
    if (commands.has(args[0])) return commands.get(args[0])(msg, args);
    if (!sounds.has(args[0])) return msg.channel.send(`That is not a valid sound, here is a list of some:\n\`${sounds.keyArray().join(', ')}\``);
    playSound(msg, sounds.get(args[0]));
  }
};