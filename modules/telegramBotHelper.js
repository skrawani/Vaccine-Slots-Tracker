const dbConnection = require("../models/db");
const TelegramBot = require("node-telegram-bot-api");
const { addUser, deleteUser } = require("../models/userService");
const {
  addPincodes,
  delPincodes,
  allPincodesbyChatId,
} = require("../models/pincodeService");

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

const sendNotifcation = (chatId, data) => {
  data = `Availble Slots : \n\n` + data;
  bot.sendMessage(chatId, data, { parse_mode: "Markdown" });
};

bot.onText(/\/start(.*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const resp = await addUser(chatId, 3600, true);
  if (resp) {
    bot.sendMessage(chatId, "New Subscription Created...");
  } else {
    bot.sendMessage(
      chatId,
      "Subsccription can't be created due to an internal error!! Try Again"
    );
  }
  bot.sendMessage(
    chatId,
    "Add/Remove Pincode by using\n /addPin pinNo1 pinNo2 ... \n /delPin pinNo1 pinNo2 ...\n" +
      "By Default Notification will be pushed every 1hr(3600 seconds) if the seats are available"
  );
});

bot.onText(/\/addPin (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const pincodes = match[1].split(" ");
  const resp = await addPincodes(chatId, pincodes);
  if (resp === true) {
    bot.sendMessage(chatId, "Pincodes Subscribed  : " + pincodes);
  } else {
    bot.sendMessage(
      chatId,
      "Pincodes can't be subscribed due to an internal error!! Try Again"
    );
  }
});

bot.onText(/\/delPin(.*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const resp = await delPincodes(chatId);
  if (resp === true) {
    bot.sendMessage(chatId, "All Pincodes Unsubscribed  : ");
  } else {
    bot.sendMessage(
      chatId,
      "Pincodes can't be Unsubscribed due to an internal error!! Try Again"
    );
  }
});
bot.onText(/\/allPin(.*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const resp = await allPincodesbyChatId(chatId);
  if (resp.success === true) {
    bot.sendMessage(chatId, "Subscribed Pincodes : " + resp.data);
  } else {
    console.log(resp.error);
    bot.sendMessage(chatId, "Internal error!! Try Again");
  }
});

bot.onText(/\/stop(.*)/, async (msg, match) => {
  const chatId = msg.chat.id;

  const resp = await deleteUser(chatId);
  if (resp === true) {
    bot.sendMessage(
      chatId,
      "Subscription Destroyed!!\nTo reSubscribe send /start"
    );
  } else {
    bot.sendMessage(
      chatId,
      "Subscription Can't Destroyed Due to internal Error!!"
    );
  }
});

module.exports = { sendNotifcation };
