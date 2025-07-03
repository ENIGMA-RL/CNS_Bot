const RPC = require('discord-rpc');
const clientId = 'your_client_id_here';

RPC.register(clientId);

const rpc = new RPC.Client({ transport: 'ipc' });

rpc.on('ready', () => {
  rpc.setActivity({
    state: 'Hacking VAIIYA',
    details: 'Hacking VAIIYA',
    largeImageKey: 'large_image',
    largeImageText: '4RCU5',
    partyId: 'ae488379-351d-4a4f-ad32-2b9b01c91657',
    partySize: 1,
    partyMax: 1,
    joinSecret: 'MTI4NzM0OjFpMmhuZToxMjMxMjM=',
  });

  console.log('Rich Presence is active');
});

rpc.login({ clientId }).catch(console.error); 