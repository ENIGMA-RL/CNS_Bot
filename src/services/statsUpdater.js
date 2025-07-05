const { EmbedBuilder } = require('discord.js');

async function updateStats(client, guild, currentTaggedUserCount) {
  const channel = guild.channels.cache.get('1390430066923798639');
  if (!channel) {
    console.error('Stats channel not found.');
    return;
  }

  const memberCount = guild.memberCount;
  const botCount = guild.members.cache.filter(member => member.user.bot).size;
  const humanCount = memberCount - botCount;
  const boostCount = guild.premiumSubscriptionCount;

  const embed = new EmbedBuilder()
    .setTitle('📊 Server Stats')
    .setColor('#b544ee')
    .addFields(
      { name: '👥 Members', value: `\`${humanCount}\`` },
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

  const timestamp = new Date().toLocaleTimeString();
  console.log(`📊 Stats updated (${timestamp})`);
}

module.exports = { updateStats }; 