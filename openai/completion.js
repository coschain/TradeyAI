const OpenAI = require("openai");

exports.getCryptoMarketInfo = async function (text) {
  const messages = [
    {
      role: "user",
      content: `Determine whether the following paragraph discusses cryptocurrency, and provide the symbols of the cryptocurrency mentioned as well as whether the sentiment is bullish or bearish. "${text}"`,
    },
  ];
  const tools = [
    {
      type: "function",
      function: {
        name: "discuss",
        description: "If the user discusses cryptocurrency.",
        parameters: {
          type: "object",
          properties: {
            symbols: {
              type: "array",
              description: "The cyptocurrency symbols which user discuss.",
              items: {
                type: "string",
              },
            },
            bull: {
              type: "boolean",
              description: "Whether the sentiment is bullish.",
            },
            bear: {
              type: "boolean",
              description: "Whether the sentiment is bearish.",
            },
          },
          required: ["symbols", "bull", "bear"],
        },
      },
    },
  ];
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_COMPLETION_MODEL,
      messages,
      tools,
      tool_choice: "auto",
    });
    console.log(`total token usage: ${completion.usage.total_tokens}`);
    if (completion.choices) {
      const message = completion.choices[0].message;
      if (message.tool_calls && message.tool_calls.length > 0) {
        let { symbols, bull, bear } = JSON.parse(
          message.tool_calls[0].function.arguments
        );
        return {
          symbols: symbols || [],
          bull: bull || false,
          bear: bear || false,
        };
      }
    }
  } catch (error) {
    console.warn(`getCryptoMarketInfo failed, error: ${error.message}`);
  }
  return { symbols: [], bull: false, bear: false };
};
