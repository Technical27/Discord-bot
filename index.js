const Discord = require('discord.js');
const winston = require('winston');
const moment = require('moment');
const fs = require('fs');
const {users, guilds} = require('./db');
const config = require('./config.json');

const client = new Discord.Client();
client.mention = /^<@!?(\d+)>$/;
client.logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({filename: config.botLogFile})
  ],
  format: winston.format.printf(log => `${moment().format('M D hh:mm:ss a')} [${log.level.toUpperCase()}] - ${log.message}`)
});
client.commands = new Discord.Collection();
client.currency = new Discord.Collection();
const cooldowns = new Discord.Collection();

client.currency.add = async (id, amount) => {
  if (client.currency.has(id)) {
    const newUser = client.currency.get(id);
    newUser.balance += Number(amount);
    return newUser.save();
  }
  const newUser = await users.create({ user_id: id, balance: amount });
  client.currency.set(id, newUser);
  return newUser;
};

client.currency.getBalance = async id => {
  const targetUser = client.currency.get(id);
  if (targetUser) return targetUser.balance;
  const newUser = await users.create({user_id: id, amount: 0});
  client.currency.set(id, newUser);
  return newUser.balance;
};

client.once('ready', async () => {
  client.logger.log('info', 'ready');
  const storedBalances = await users.findAll();
  storedBalances.forEach(b => client.currency.set(b['user_id'], b));
  client.guilds.forEach(g => guilds.upsert({guildId: g.id}));
});

client.on('message', async msg => {
  if (msg.author.bot) return;
  const {prefix} = await guilds.findOne({where: {guildId: msg.guild.id}});
  if (!msg.content.startsWith(prefix)) return client.currency.add(msg.author.id, 1);

  const args = msg.content.slice(prefix.length).split(/\s+/);
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));
  if (!cmd) return;

  if (cmd.guildOnly && msg.channel.type !== 'text') return msg.channel.send('This command can\'t be run in DMs');
  if (cmd.args && args.length < 1) return msg.channel.send(`You need arguments for this command, the correct usage is\n\`<command> ${cmd.usage}\``);

  if (!cooldowns.has(msg.author.id)) cooldowns.set(msg.author.id, new Discord.Collection());
  const now = Date.now();
  const timestamps = cooldowns.get(msg.author.id);
  const cooldownAmount = (cmd.cooldown || config.defaultCooldown) * 1000;

  if (timestamps.has(cmd.name)) {
    const exp = timestamps.get(cmd.name) + cooldownAmount;
    if (exp > now) {
      const time = (exp - now) / 1000;
      return msg.channel.send(`You need to wait ${time.toFixed(2)} seconds before trying \`${cmd.name}\` again!`);
    }
  }
  else {
    timestamps.set(cmd.name, now);
    setTimeout(() => timestamps.delete(cmd.name), cooldownAmount);
  }

  try {
    cmd.execute(msg, args);
  }
  catch (e) {
    client.logger.log('error', e);
    msg.channel.send(`something broke while running your command, here is the error:\n\`${e}\``);
  }
});

process.on('SIGINT', async () => {
  client.logger.log('info', 'bot shutting down');
  await client.destroy();
  process.exit();
});

process.on('unhandledRejection', err => client.logger.log('error', `Unhandled Promise Rejection: ${err}`));

const files = fs.readdirSync(config.cmdPath).filter(f => f.endsWith('.js'));
for (const f of files) {
  const file = require(`${config.cmdPath}/${f}`);
  client.commands.set(file.name, file);
}

client.login(process.env.DISCORD_TOKEN);