//! This is meant for bot not having the slashCommands
const Env = require("./config/env");
const {
  Client,
  IntentsBitField,
  EmbedBuilder,
  PermissionFlagsBits,
  GatewayIntentBits,
} = require("discord.js");
const registerCommand = require("./commands/register");
const BotServices = require("./botServices");
const { extractTokenFromMsg } = require("./util");

// registerCommand();

const botServices = new BotServices();

const BOT_MSG_PREFIX = "$";

const log = (...param) => console.log(...param);

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [PermissionFlagsBits.SendMessages],
});

client.on("ready", async () => {
  console.log(`✅ ${client.user.tag} is online.`);
});

client.on("messageCreate", async (interaction) => {
  const embed = new EmbedBuilder();
  try {
    const isBot = interaction?.author?.bot;
    if (isBot) return;

    const VALID_COMMANDS = ["thread", "shows", "authenticate", "help"];
    const { content, options, channelId } = interaction;

    const userMsg = content;

    if (!userMsg.startsWith(BOT_MSG_PREFIX)) return;

    const commandName = userMsg.split(" ")[0].replace("$", "");

    if (!VALID_COMMANDS.includes(commandName)) {
      const embeddMsg = embed
        .setTitle(`❌ Opps, Wrong Command.`)
        .setDescription(
          `Unknown command. The valid commands are: **threads**, **show**, and **authenticate**. For assistance, type **'!help'** to see a list of available commands.`
        )
        .setColor(0xff0000);
      interaction.reply({ embeds: [embeddMsg], ephemeral: true });
      return;
    }

    if (commandName === "help") {
      const embeddMsg = embed
        .setTitle(`✅ Help Commands.`)
        .setDescription(
          `- **$thread**: Because who doesn't want to keep up with the latest thread drama? Get latest thread on showwcase.\n- **$show**: Get your front-row seat to the latest Showwcase shows, guaranteed to make you say 'meh'.\n- **$authenticate**: Authenticate showwcial notifier **variant**.\n- **$help**: Show lists of commands for showwcial bot.
            `
        )
        .setColor(0x3f7eee);
      interaction.reply({ embeds: [embeddMsg], ephemeral: true });
      return;
    }
    if (commandName === "authenticate") {
      const result = extractTokenFromMsg(userMsg);
      if (!result?.valid) {
        const embeddMsg = embed
          .setTitle(`❌ Something went wrong.`)
          .setDescription(result?.message)
          .setColor(0xff0000);
        interaction.reply({ embeds: [embeddMsg], ephemeral: true });
        return;
      }

      const tokenValue = result?.content;

      // make authentication requests.
      const response = await botServices.authenticateBot(tokenValue, channelId);
      const embeddColor = response?.success ? 0x3f7eee : 0xff0000;
      const embeddTitle = response?.success
        ? `✅ **Successful Authenticaton**`
        : `❌ **Failed Authentication**`;
      const embeddMsg = embed
        .setTitle(embeddTitle)
        .setDescription(response?.message)
        .setColor(embeddColor);

      // handle response.
      // * ephemeral: true would only make the message visible to sender.
      if (response?.success === false)
        interaction.reply({ embeds: [embeddMsg], ephemeral: true });
      if (response?.success === true)
        interaction.reply({ embeds: [embeddMsg], ephemeral: true });
      return;
    }
    if (commandName === "thread") {
      try {
        console.log({ channelId });
        const response = await botServices.handleThreads(channelId);
        const embeddColor = response?.success ? 0x3f7eee : 0xff0000;
        const embeddTitle = response?.success
          ? `✅ **Latest Thread**`
          : `❌ **Failed Fetching Thread**`;
        const embeddImage = response?.success
          ? response?.image ??
            "https://images-ext-1.discordapp.net/external/qzgQmLYic48-UPuxj52aRYm9vXgpjvUoXqNXPUvwWxE/https/assets.showwcase.com/og-image/default.png?width=1382&height=972"
          : "https://img.freepik.com/free-vector/400-error-bad-request-concept-illustration_114360-1933.jpg?w=1000";

        let embeddMsg = embed
          .setTitle(embeddTitle)
          .setDescription(response?.content ?? response?.msg)
          .setColor(embeddColor)
          .setURL(response?.url)
          .setImage(embeddImage);

        // * ephemeral: true would only make the message visible to sender.
        if (response?.success === false)
          interaction.reply({ embeds: [embeddMsg], ephemeral: true });
        if (response?.success === true)
          interaction.reply({
            embeds: [embeddMsg],
            ephemeral: false,
          });
        return;
      } catch (e) {
        // console.log(e);
        const embeddMsg = embed
          .setTitle(`❌ **Failed Fetching Thread**`)
          .setDescription(`Something went wrong. Please try again later.`);
        interaction.reply({ embeds: [embeddMsg], ephemeral: true });
      }
    }
    if (commandName === "shows") {
      try {
        const response = await botServices.handleShows(channelId);
        const embeddColor = response?.success ? 0x3f7eee : 0xff0000;
        const embeddTitle = response?.success
          ? `✅ **Latest Shows**`
          : `❌ **Failed Fetching Shows**`;
        const embeddImage = response?.success
          ? response?.image ??
            "https://images-ext-1.discordapp.net/external/qzgQmLYic48-UPuxj52aRYm9vXgpjvUoXqNXPUvwWxE/https/assets.showwcase.com/og-image/default.png?width=1382&height=972"
          : "https://img.freepik.com/free-vector/400-error-bad-request-concept-illustration_114360-1933.jpg?w=1000";

        let embeddMsg = embed
          .setTitle(embeddTitle)
          .setDescription(response?.content ?? response?.msg)
          .setColor(embeddColor)
          .setURL(response?.url)
          .setImage(embeddImage);

        // * ephemeral: true would only make the message visible to sender.
        if (response?.success === false)
          interaction.reply({ embeds: [embeddMsg], ephemeral: true });
        if (response?.success === true)
          interaction.reply({
            embeds: [embeddMsg],
            ephemeral: false,
          });
        return;
      } catch (e) {
        console.log(e);
        const embeddMsg = embed
          .setTitle(`❌ **Failed Fetching Thread**`)
          .setDescription(`Something went wrong. Please try again later.`);
        interaction.reply({ embeds: [embeddMsg], ephemeral: true });
      }
    }
  } catch (err) {
    console.log(`Discord error: ${err}`);
    const title =
      err?.res?.code === "ECONNREFUSED"
        ? "Server Error 😞"
        : "❌ *An Error Occured!!*";
    const embeddMsg = embed
      .setTitle(title)
      .setDescription("Something went wrong, please try again later.")
      .setColor(0xff0000);
    interaction.reply({ embeds: [embeddMsg], ephemeral: true });
  }
});

client.login(Env.discordToken);
