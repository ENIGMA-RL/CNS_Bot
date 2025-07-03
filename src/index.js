const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const logger = require('../utils/logger');

// Create a new Discord client with required intents for reading messages and guilds
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

// Load all command files from the commands directory
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const commands = [];

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command);
}

client.once('ready', async () => {
  

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(client.user.id, '1026532204706271252'),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }

  // Rich Presence Setup
  client.user.setPresence({
    activities: [
      {
        name: 'Attack on VAIIYA',
        type: 0, // Playing
      },
    ],
    status: 'online',
  });
  
  console.log('Bot Presence is active');

  console.log('Bot is ready!');
  
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command =
    commands.find(cmd => cmd.name === interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (error.code === 'InteractionCollectorError') {
      await interaction.followUp({
        content: 'There was an error trying to execute that command!',
        ephemeral: true,
      }).catch(err => {
        if (err) {
          logger.error(err);
        }
      });
    } else {
      await interaction.followUp({
        content: 'There was an error trying to execute that command!',
        ephemeral: true,
      }).catch(err => {
        if (err) {
          logger.error(err);
        }
      });
    }
  }
});

client.login(process.env.TOKEN); 