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
  cowinApiHelper,
} = require("./modules/cowinHelper");
const { sendNotifcation } = require("./modules/telegramBotHelper");
const emailHelper = require("./modules/emailHelper");
const got = require("got");
const axios = require("axios");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cron.schedule("*/10 * * * *", async () => {
//   // cron.schedule("* * * * *", async () => {
//   console.log("Every Minute task!!");
//   const chatIdtoPincodeMapResp = await getPinCodesPerChatId();
//   const chatIdtoPincodeMap = chatIdtoPincodeMapResp.data;
//   const pincodes = await getAllPincodes();
//   if (!pincodes.success) {
//     console.log(pincodes.error);
//   }
//   const pincodeToDataMap = await mapPincodeToDataHelper(pincodes.data);

//   for (const [chatId, pincodes] of chatIdtoPincodeMap.entries()) {
//     let msg = "";
//     for (const pincode of pincodes) {
//       msg += jsonToTable(pincodeToDataMap.get(pincode));
//     }

//     if (msg.length === 0) continue;
//     sendNotifcation(chatId, msg);
//   }
// });

// cron.schedule(
//   "0 1 * * *",
//   async () => {
//     const date = new Date()
//       .toLocaleDateString("en-IN", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//       })
//       .replace(/\//g, "-");
//     await emailHelper("sachin.storm.sr@gmail.com", "Daily Logs", date);
//   },
//   true
// );
app.get("/", async (req, res) => {
  const date = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const pinCode = 751024;
  const apiUrl = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${pinCode}&date=${date}`;
  let options = {
    headers: {
      accept: "application/json, text/plain",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      origin: "https://www.cowin.gov.in",
      referer: "https://www.cowin.gov.in/",
      "user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
    },
  };
  // const tempData = await got(apiUrl,);
  try {
    const response = await axios.get(apiUrl, options);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }

  res.send("Hey Telegram Bot");
});

app.listen(PORT, () => {
  console.log("server started at " + PORT);
});
