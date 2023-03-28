const qrCode = require("qrcode-terminal");

// Dotenv setup
require("dotenv").config();
const openAiApiKey = process.env.openai_api_key;

// OpenAI setup
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: openAiApiKey,
});
const openai = new OpenAIApi(configuration);

async function getResponse(prompt) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    max_tokens: 50,
    temperature: 0,
  });
  return response.data.choices[0].text;
}

// Whatsapp web setup
const { Client, LocalAuth } = require("whatsapp-web.js");
const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrCode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (message) => {
  // console.log(message);
  if (message.body.length > 0) {
    const response = await getResponse(message.body);
    // console.log(response);
    message.reply(response);
  }
});

client.initialize();
