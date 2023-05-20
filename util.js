const BOT_MSG_PREFIX = "$";

function extractTokenFromMsg(msg) {
  let res = { valid: false, message: null, content: null };
  const splitMsg = msg.split(" ");

  // * check if user is trying to authenticate bot to a channel.
  // * If splitted message is > 2 i.e Invalid: [commandName, Token, SomethingElse, ....], Valid: [commandName, Token]
  if (splitMsg.length > 2 || splitMsg.length === 1 || splitMsg.length === 0) {
    res["message"] = `😞 Expected a valid *Token* for bot authentication.`;
    return res;
  }

  const showwcialBotToken = splitMsg[splitMsg.length - 1];
  res["valid"] = true;
  res["message"] = null;
  res["content"] = showwcialBotToken;

  return res;
}

module.exports = {
  extractTokenFromMsg,
};
