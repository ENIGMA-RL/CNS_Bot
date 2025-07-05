const { getUserData } = require('./userService');

async function fetchMembers(guild) {
  await guild.members.fetch();
  console.log('✅ Fetched members');

  let membersUsingTag = 0;

  for (const member of guild.members.cache.values()) {
    try {
      const data = await getUserData(member.id);
      if (data?.primary_guild?.identity_enabled && data?.primary_guild?.tag === 'CNS') {
        membersUsingTag++;
      }
      await new Promise(resolve => setTimeout(resolve, 20)); 
    } catch (err) {
      console.error(`Failed to fetch user data for ID ${member.id}`);
    }
  }

  console.log(`✅ Total CNS-tagged users: ${membersUsingTag}`);
  console.log('✅ Finished logging all members.');
  return membersUsingTag;
}

module.exports = { fetchMembers }; 