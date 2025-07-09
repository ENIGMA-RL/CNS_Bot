const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { updateStats } = require('./services/statsUpdater');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

// Load commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Initialize commands collection
client.commands = [];

// Register each command
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (!client.commands.some(cmd => cmd.name === command.name)) {
    client.commands.push(command);
  }
}

// Event handlers
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  require('./events/botReady')(client);
});

client.on('raw', async (packet) => {
  console.log(`Event received: ${packet.t}`);
  if (packet.t === 'GUILD_MEMBER_UPDATE') {
    const user = packet.d.user;
    const tagData = user?.primary_guild;
    const guildId = packet.d.guild_id;
    const userId = user.id;

    if (!tagData) return;

    const isUsingTag = tagData.identity_enabled && tagData.identity_guild_id === guildId;

    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      console.error('Guild not found in cache.');
      return;
    }

    const member = guild.members.cache.get(userId);
    if (!member) {
      console.error('Member not found in cache.');
      return;
    }

    const roleId = '1389859132198096946';

    if (isUsingTag) {
      if (!member.roles.cache.has(roleId)) {
        await member.roles.add(roleId);
        console.log(`Added role to ${member.user.tag} for using tag.`);
      }
    } else {
      if (member.roles.cache.has(roleId)) {
        await member.roles.remove(roleId);
        console.log(`Removed role from ${member.user.tag} for removing tag.`);
      }
    }

    // Update stats after role change
    const membersWithRole = guild.members.cache.filter(m => m.roles.cache.has(roleId)).size;
    await updateStats(client, guild, membersWithRole);
    console.log(`User ${member.user.tag} isUsingTag: ${isUsingTag}`);
    console.log(`Current members with role: ${membersWithRole}`);
  }
});

client.on('guildMemberAdd', async (member) => {
  console.log(`Event received: guildMemberAdd for ${member.user.tag}`);
  console.log(`Member joined: ${member.user.tag}`);
  const guild = member.guild;
  const roleId = '1389859132198096946';
  const membersWithRole = guild.members.cache.filter(m => m.roles.cache.has(roleId)).size;
  await updateStats(client, guild, membersWithRole);
});

client.on('guildMemberRemove', async (member) => {
  console.log(`Event received: guildMemberRemove for ${member.user.tag}`);
  console.log(`Member left: ${member.user.tag}`);
  const guild = member.guild;
  const roleId = '1389859132198096946';
  const membersWithRole = guild.members.cache.filter(m => m.roles.cache.has(roleId)).size;
  await updateStats(client, guild, membersWithRole);
});

client.on('interactionCreate', interaction => require('./events/commandHandler')(client, interaction));

client.login(process.env.PROD_TOKEN);
