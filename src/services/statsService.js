const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { EmbedBuilder } = require('discord.js');

async function getUserData(userId) {
  try {
    const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
      headers: {
        Authorization: `Bot ${process.env.TOKEN}`,
      },
      timeout: 10000,
    });

    if (!response.ok) {
      console.error(`Failed to fetch user data for ID ${userId}`);
      return null;
    }

    return response.json();
  } catch (error) {
    if (error.code === 'UND_ERR_CONNECT_TIMEOUT') {
      console.error(`Timeout fetching user data for ID ${userId}`);
      return null; 
    }
    console.error(`Error fetching user data for ID ${userId}:`, error);
    return null;
  }
}

async function updateStats(client, guild) {
  const channel = guild.channels.cache.get('1390430066923798639');
  if (!channel) {
    console.error('Stats channel not found.');
    return;
  }

  const memberCount = guild.memberCount;
  const boostCount = guild.premiumSubscriptionCount;

  const embed = new EmbedBuilder()
    .setTitle('Server Stats')
    .setColor('#b544ee')
    .addFields(
      { name: '👥 Members', value: `\`${memberCount}\`` },
      { name: '💜 CNS Tags', value: `\`${client.currentTaggedUserCount}\`` },
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

  console.log(`📊 Stats updated (${timestamp})`);
}

module.exports = { getUserData, updateStats }; 