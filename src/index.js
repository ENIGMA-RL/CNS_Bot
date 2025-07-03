const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const logger = require('../utils/logger');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Shared tag count
let currentTaggedUserCount = 0;

async function getUserData(userId) {
  const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
    headers: {
      Authorization: `Bot ${process.env.TOKEN}`,
    },
    timeout: 20000, // Increase timeout to 20 seconds
  });

  if (!response.ok) {
    console.error(`Failed to fetch user data for ID ${userId}`);
    return null;
  }

  return response.json();
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
});

// Load slash commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const commands = commandFiles.map(file => require(`./commands/${file}`));

client.once('ready', async () => {
  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  console.log('Starting bot...');

  try {
    await rest.put(
      Routes.applicationGuildCommands(client.user.id, '1026532204706271252'),
      { body: commands }
    );
    console.log('✅ Succesfully Registered slash commands.');
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
  console.log('🔍 Fetched members.');

  let membersUsingTag = 0;

  for (const member of guild.members.cache.values()) {
    try {
      const data = await getUserData(member.id);
      if (data?.primary_guild?.identity_enabled && data?.primary_guild?.tag === 'CNS') {
        membersUsingTag++;
      }
      await new Promise(resolve => setTimeout(resolve, 100)); // to avoid rate limit
    } catch (err) {
      console.error(`Failed to fetch user data for ID ${member.id}`);
    }
  }

  currentTaggedUserCount = membersUsingTag;
  console.log(`✅ Total CNS-tagged users: ${membersUsingTag}`);
  console.log('✅ Finished logging all members.');

  // Update server stats
  const updateStats = async () => {
    const channel = guild.channels.cache.get('1390430066923798639');
    if (!channel) {
      console.error('Stats channel not found.');
      return;
    }

    const memberCount = guild.memberCount;
    const boostCount = guild.premiumSubscriptionCount;

    const embed = new EmbedBuilder()
      .setTitle('📊 CNS Server Statistics')
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

    console.log(`📊 Stats updated: ${currentTaggedUserCount} tagged users`);
  };

  await updateStats();
  setInterval(updateStats, 5 * 60 * 1000);

  console.log('🤖 Bot is ready!');
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = commands.find(cmd => cmd.name === interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    const msg = 'There was an error trying to execute that command!';
    try {
      await interaction.followUp({ content: msg, ephemeral: true });
    } catch (err) {
      logger.error(err);
    }
  }
});

client.login(process.env.TOKEN);
