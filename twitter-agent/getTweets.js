const initTwitterAgent = require("./initTweetAgent");

module.exports = async function (userList, startTime) {
  if (userList.length === 0) {
    return;
  }
  const agent = await initTwitterAgent();
  let kolTweets = [];
  for (const twitterUserName of userList) {
    try {
      console.log(`Getting tweets for ${twitterUserName}...`);
      const profile = await agent.getProfile(twitterUserName);
      let cursor = null;
      let retry = 0;
      while (startTime && retry < 3) {
        const response = await agent.getUserTweets(profile.userId, 20, cursor);
        const { tweets, next } = response;
        kolTweets = kolTweets.concat(
          tweets.filter((tweet) => tweet.timestamp >= startTime)
        );
        if (tweets.length === 0 || !next) {
          break;
        }
        cursor = next;
        retry++;
      }
    } catch (error) {
      console.error(error);
    }
  }
  return kolTweets;
};
