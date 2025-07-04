module.exports = async (client, interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.find(cmd => cmd.name === interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    const msg = 'There was an error trying to execute that command!';
    try {
      await interaction.followUp({ content: msg, flags: 64 });
    } catch (err) {
      console.error(err);
    }
  }
}; 