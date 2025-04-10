const axios = require("axios");

exports.send = async function (msg) {
  const webHookUrl = process.env.WEBHOOK_URL;
  if (!webHookUrl || webHookUrl.length === 0) {
    console.warn("webhook url is not set");
    return;
  }
  try {
    let body = {
      msg_type: "text",
      content: {
        text: msg,
      },
    };
    console.log(webHookUrl, body);
    const res = await axios.post(webHookUrl, body);
    return res.data;
  } catch (err) {
    console.warn("send webhook error:", err.meesage);
    return null;
  }
};
