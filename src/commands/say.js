const { sayCommandRoles } = require('../../config/roles');

module.exports = {
  name: 'say',
  description: 'Make the bot say something!',
  options: [
    {
      name: 'message',
      type: 3,
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
				flags: 64,
			});			
    }

    let message = interaction.options.getString('message');
message = message.replace(/\\n/g, '\n');

    await interaction.channel.send(message);

    await interaction.reply({
			content: '✅ Message sent!',
			flags: 64,
		});		
  },
};
