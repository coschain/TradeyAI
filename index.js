const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "./.env") });

const getTweets = require("./twitter-agent/getTweets");
const { getCryptoMarketInfo } = require("./openai/completion");
const { send } = require("./signal/webhook");

(async () => {
  const token = process.env.CRYPTO_TOKEN_SYMBOL;
  if (!token || token.length === 0) {
    console.log("CRYPTO_TOKEN_SYMBOL is not set");
    return;
  }

  //get KOL's tweets 1 hour ago
  const kols = require("./kols.json");
  const startTime = Date.now() / 1000 - 3600;
  const tweets = await getTweets(kols, startTime);

  //determine whether tweets are bullish or bearish
  let tweetCounts = {
    bull: 0,
    bear: 0,
  };

  for (const tweet of tweets) {
    ///remove newlines and other whitespace
    const text = tweet.text.replace(/[\r\n\x0B\x0C\u0085\u2028\u2029]+/g, "");

    //get market info from openai
    const { symbols, bull, bear } = await getCryptoMarketInfo(text);
    console.log(
      `${tweet.username}:${text}, bull: ${bull}, bear: ${bear}, symbols: ${symbols}`
    );

    ///check if tweet contains token
    const uppercasedSymbol = symbols.map((symbol) => symbol.toUpperCase());
    if (uppercasedSymbol.includes(token)) {
      if (bull) {
        tweetCounts.bull++;
      } else if (bear) {
        tweetCounts.bear++;
      }
    }
  }

  //determine if bullish or bearish signal
  console.log(
    `${tweetCounts.bull} bull tweets, ${tweetCounts.bear} bear tweets`
  );
  if (tweetCounts.bull > tweetCounts.bear) {
    console.log("Bullish signal found");
    await send(`🟢 Crypto KOLs see BULLISH potential for ${token}!`);
  } else if (tweetCounts.bull < tweetCounts.bear) {
    console.log("Bearish signal found");
    await send(`🔴 Crypto KOLs see BEARISH potential for ${token}!`);
  } else {
    console.log("No bullish or bearish signal found");
  }
})();
