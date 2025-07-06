const { REST, Routes } = require('discord.js');
require('dotenv').config();

const clientId = '1390367013351981077';
const rest = new REST({ version: '10' }).setToken(process.env.PROD_TOKEN);

async function deletePingCommand() {
  try {
    const commands = await rest.get(Routes.applicationCommands(clientId));
    for (const command of commands) {
      if (command.name === 'ping') {
        await rest.delete(Routes.applicationCommand(clientId, command.id));
        console.log(`Deleted command ${command.name}`);
      }
    }
  } catch (error) {
    console.error('Error deleting commands:', error);
  }
}

deletePingCommand(); 