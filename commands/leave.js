module.exports = {
  name: 'leave',
  description: 'leaves the current voice channel',
  usage: '',
  execute: (msg, args) => {
    const vc = msg.guild.voiceConnection;
    if (vc) vc.disconnect();
  }
};