const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const logger = require('../utils/logger');

// Create a new Discord client with required intents for reading messages and guilds
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Log when the bot successfully connects
client.once('ready', () => {
  logger.info(`Logged in as ${client.user.tag}!`);
});

// Handle and log any client errors
client.on('error', error => {
  logger.error('Client error:', error);
});

// Handle and log any client warnings
client.on('warn', warning => {
  logger.warn('Client warning:', warning);
});

// Initialize a Map to store bot commands
client.commands = new Map();

// Load all command files from the commands directory
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Register each command in the commands Map
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.name, command);
}

// Load all event files from the events directory
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

// Register each event handler
// Events marked as 'once' will only trigger once
// Other events will trigger every time they occur
for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Log in the bot using the token from environment variables
client.login(process.env.DISCORD_TOKEN).catch(error => {
  logger.error('Login error:', error);
}); 