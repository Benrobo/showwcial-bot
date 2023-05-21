const dotenv = require("dotenv");
dotenv.config();

const Env = {
  discordClientId: process.env.DISCORD_CLIENT_ID,
  discordToken: process.env.DISCORD_TOKEN,
  // guildId: "1109733408600506529",
  backendApi:
    process.env.NODE_ENV !== "production"
      ? "http://localhost:3000/api"
      : process.env.ShowwcialBackend,
};

module.exports = Env;
