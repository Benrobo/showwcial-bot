// ! This is meant for handling the 'slashCommands'.
const keep_alive = require("./keep_alive");
const Env = require("./config/env");
const { Client, IntentsBitField, EmbedBuilder } = require("discord.js");
const registerCommand = require("./commands/register");
const BotServices = require("./botServices");
const { sleep } = require("./util");

registerCommand();

const botServices = new BotServices();

const client = new Client({
  intents: [IntentsBitField.Flags.Guilds],
});

client.on("ready", async () => {
  console.log(`✅ ${client.user.tag} is online.`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const embed = new EmbedBuilder();

  try {
    const { commandName, options, channelId } = interaction;
    console.log({ channelId });
    // handle bot authentication.
    if (commandName === "authenticate") {
      const tokenInput = interaction.options.get("token");
      const tokenValue = tokenInput.value;

      // make authentication requests.
      await interaction.deferReply();
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
      await interaction.editReply({
        embeds: [embeddMsg],
        ephemeral: response?.success ? false : true,
      });
    }
    if (commandName === "threads") {
      try {
        await interaction.deferReply();
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
        await interaction.editReply({
          embeds: [embeddMsg],
          ephemeral: response?.success ? false : true,
        });
      } catch (e) {
        console.log(e);
        const embeddMsg = embed
          .setTitle(`❌ **Failed Fetching Thread**`)
          .setDescription(`Something went wrong. Please try again later.`);
        interaction.reply({ embeds: [embeddMsg], ephemeral: true });
      }
    }
    if (commandName === "shows") {
      try {
        await interaction.deferReply();
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
        await interaction.editReply({
          embeds: [embeddMsg],
          ephemeral: response?.success ? false : true,
        });
      } catch (e) {
        console.log(e);
        const embeddMsg = embed
          .setTitle(`❌ **Failed Fetching Thread**`)
          .setDescription(`Something went wrong. Please try again later.`);
        interaction.reply({ embeds: [embeddMsg], ephemeral: true });
      }
    }
    if (commandName === "jobs" || commandName === "job") {
      // ! coming soon
      const title = "🔔 *Coming Soon*";
      const embeddMsg = embed
        .setTitle(title)
        .setDescription("This feature isn't available now.")
        .setColor(0x3f7eee);
      interaction.reply({ embeds: [embeddMsg], ephemeral: true });
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
