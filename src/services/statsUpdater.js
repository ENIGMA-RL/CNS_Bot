const { EmbedBuilder } = require('discord.js');

async function updateStats(client, guild, currentTaggedUserCount) {
  const channel = guild.channels.cache.get('1390430066923798639');
  if (!channel) {
    console.error('Stats channel not found.');
    return;
  }

  const memberCount = guild.memberCount;
  const boostCount = guild.premiumSubscriptionCount;

  const embed = new EmbedBuilder()
    .setTitle('📊 Server Statistics')
    .setColor('#b544ee')
    .addFields(
      { name: '👥 Members', value: `\`${memberCount}\`` },
      { name: '💜 CNS Tags', value: `\`${currentTaggedUserCount}\`` },
      { name: '💎 Server Boosts', value: `\`${boostCount}\`` }
    )
    .setTimestamp();

  const messages = await channel.messages.fetch({ limit: 10 });
  const botMessage = messages.find(msg => msg.author.id === client.user.id);

  if (botMessage) {
    await botMessage.edit({ embeds: [embed] });
  } else {
    await channel.send({ embeds: [embed] });
  }

  const timestamp = new Date().toLocaleString();
  console.log(`📊 Stats updated: ${currentTaggedUserCount} tagged users (${timestamp})`);
}

module.exports = { updateStats }; 