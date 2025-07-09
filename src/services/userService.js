const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

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
      return null; // Skip this step and continue
    }
    console.error(`Error fetching user data for ID ${userId}:`, error);
    return null;
  }
}

module.exports = { getUserData }; 