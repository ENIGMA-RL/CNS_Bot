const { REST, Routes } = require('discord.js');

async function registerCommands(client) {
  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  try {
    await rest.put(Routes.applicationCommands(client.user.id), { body: client.commands });
    console.log('✅ Successfully registered GLOBAL slash commands.');
    console.log('Commands registered:', client.commands.map(cmd => cmd.name).join(', '));
  } catch (error) {
    console.error('❌ Error registering slash commands:', error);
  }
}

module.exports = { registerCommands }; 