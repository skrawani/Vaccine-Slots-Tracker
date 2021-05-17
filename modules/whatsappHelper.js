const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const whatsappHelper = () => {
  client.messages
    .create({
      from: "whatsapp:+14155238886",
      body: msg,
      to: "whatsapp:+919556193085",
      mediaUrl: "./sample.log",
    })
    .then((message) => console.log(message.sid))
    .catch((err) => console.log(err));
};

module.exports = whatsappHelper;
