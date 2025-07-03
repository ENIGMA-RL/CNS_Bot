module.exports = {
  name: 'ping',
  description: 'Replies with Pong!',
  options: [],

  async execute(interaction) {
    await interaction.reply('Pong!');
  },
};
