module.exports = {
  name: 'test',
  description: 'A command to test the bot',
  cooldown: 2,
  usage: '',
  execute: (msg, args) => {
    msg.channel.send('Did this work?');
  }
};