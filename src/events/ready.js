const { REST, Routes, EmbedBuilder } = require('discord.js');
const { getUserData, updateStats } = require('../services/statsService');

module.exports = async (client) => {
  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  console.log('Starting bot...');

  try {
    await rest.put(Routes.applicationCommands(client.user.id), { body: client.commands });
    console.log('✅ Successfully registered GLOBAL slash commands.');
  } catch (error) {
    console.error('❌ Error registering slash commands:', error);
  }

  client.user.setPresence({
    activities: [{ name: 'Attack on VAIIYA', type: 0 }],
    status: 'online',
  });

  const guild = client.guilds.cache.get('1026532204706271252');
  if (!guild) {
    console.error('❌ Guild not found.');
    return;
  }

  await guild.members.fetch();
  console.log('✅ Fetched members');

  let membersUsingTag = 0;

  for (const member of guild.members.cache.values()) {
    try {
      const data = await getUserData(member.id);
      if (data?.primary_guild?.identity_enabled && data?.primary_guild?.tag === 'CNS') {
        membersUsingTag++;
      }
      await new Promise(resolve => setTimeout(resolve, 20));
    } catch (err) {
      console.error(`Failed to fetch user data for ID ${member.id}`);
    }
  }

  client.currentTaggedUserCount = membersUsingTag;

  await updateStats(client, guild);
  setInterval(() => updateStats(client, guild), 5 * 60 * 1000);

  console.log('🤖 Bot is ready!');
}; 