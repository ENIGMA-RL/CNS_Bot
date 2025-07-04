const { registerCommands } = require('../services/commandRegistrar');
const { fetchMembers } = require('../services/memberFetcher');
const { updateStats } = require('../services/statsUpdater');
const { setPresence } = require('../services/presenceService');

module.exports = async (client) => {
  console.log('Starting bot...');

  // Set presence
  setPresence(client);

  // Fetch guild
  const guild = client.guilds.cache.get('1026532204706271252');
  if (!guild) {
    console.error('❌ Guild not found.');
    return;
  }

  // Fetch members
  const membersUsingTag = await fetchMembers(guild);
  client.currentTaggedUserCount = membersUsingTag;

  // Update stats
  await updateStats(client, guild, membersUsingTag);
  setInterval(() => updateStats(client, guild, membersUsingTag), 5 * 60 * 1000);

  console.log('🤖 Bot is ready!');
}; 