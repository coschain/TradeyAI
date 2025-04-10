const { Scraper } = require("agent-twitter-client");

module.exports = async function () {
  const scraper = new Scraper();
  const cookiesArray = [
    {
      key: "auth_token",
      value: process.env.TWITTER_COOKIES_AUTH_TOKEN,
      domain: ".twitter.com",
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "None",
    },
    {
      key: "ct0",
      value: process.env.TWITTER_COOKIES_CT0,
      domain: ".twitter.com",
      path: "/",
      httpOnly: false,
      secure: true,
      sameSite: "Lax",
    },
  ];
  const cookieStrings = cookiesArray.map(
    (cookie) =>
      `${cookie.key}=${cookie.value}; Domain=${cookie.domain}; Path=${
        cookie.path
      }; ${cookie.secure ? "Secure" : ""}; ${
        cookie.httpOnly ? "HttpOnly" : ""
      }; SameSite=${cookie.sameSite || "Lax"}`
  );

  await scraper.setCookies(cookieStrings);

  try {
    if (await scraper.isLoggedIn()) {
      console.info("Twitter agent is logged in by cookies");
    } else {
      console.error("Twitter login error");
    }
  } catch (error) {
    console.error("Twitter login error", error.message);
  }
  return scraper;
};
