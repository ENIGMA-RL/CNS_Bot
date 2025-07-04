const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
});

// Load commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
client.commands = commandFiles.map(file => require(`./commands/${file}`));

// Event handlers
client.once('ready', () => require('./events/botReady')(client));
client.on('interactionCreate', interaction => require('./events/commandHandler')(client, interaction));

client.login(process.env.TOKEN);
