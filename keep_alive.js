const express = require("express");

const app = express();

const port = process.env.PORT || 3421;

app.all("/", (req, res) => {
  return res.status(200).send(`✅ Showwcial-Bot is online.`);
});

app.listen(port, () => console.log(`Bot server listening on ${port}`));
