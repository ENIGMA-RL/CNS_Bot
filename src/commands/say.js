const { sayCommandRoles } = require('../../config/roles');

module.exports = {
  name: 'say',
  description: 'Make the bot say something!',
  options: [
    {
      name: 'message',
      type: 3, // STRING type
      description: 'The message to say',
      required: true,
    },
  ],
  async execute(interaction) {
    const memberRoles = interaction.member.roles.cache;
    const hasRole = sayCommandRoles.some(role => memberRoles.has(role));

    if (!hasRole) {
      return interaction.reply({
        content: '🚫 You do not have permission to use this command.',
        ephemeral: true,
      });
    }

    let message = interaction.options.getString('message');
message = message.replace(/\\n/g, '\n');

    // Send the message publicly as the bot
    await interaction.channel.send(message);

    // Acknowledge the interaction privately
    await interaction.reply({
      content: '✅ Message sent!',
      ephemeral: true,
    });
  },
};
