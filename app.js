require("dotenv").config();

const express = require("express");
const app = express();
const cron = require("node-cron");
const PORT = process.env.PORT || 3000;
const {
  getAllPincodes,
  getPinCodesPerChatId,
} = require("./models/pincodeService");
const {
  jsonToTable,
  mapPincodeToDataHelper,
} = require("./modules/cowinHelper");
const { sendNotifcation } = require("./modules/telegramBotHelper");
const emailHelper = require("./modules/emailHelper");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

cron.schedule("*/10 * * * *", async () => {
  // cron.schedule("* * * * *", async () => {
  console.log("Every Minute task!!");
  const chatIdtoPincodeMapResp = await getPinCodesPerChatId();
  const chatIdtoPincodeMap = chatIdtoPincodeMapResp.data;
  const pincodes = await getAllPincodes();
  if (!pincodes.success) {
    console.log(pincodes.error);
  }
  const pincodeToDataMap = await mapPincodeToDataHelper(pincodes.data);

  for (const [chatId, pincodes] of chatIdtoPincodeMap.entries()) {
    let msg = "";
    for (const pincode of pincodes) {
      msg += jsonToTable(pincodeToDataMap.get(pincode));
    }

    if (msg.length === 0) continue;
    sendNotifcation(chatId, msg);
  }
});

cron.schedule(
  "0 1 * * *",
  async () => {
    const date = new Date()
      .toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
    await emailHelper("sachin.storm.sr@gmail.com", "Daily Logs", date);
  },
  true
);

app.listen(PORT, () => {
  console.log("server started at " + PORT);
});
