function setPresence(client) {
  client.user.setPresence({
    activities: [{ name: 'Watching VAIIYA', type: 0 }],
    status: 'online',
  });
  console.log('✅ Presence set');
}

module.exports = { setPresence }; 