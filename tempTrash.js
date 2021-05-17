const telegramBot = () => {
  // bot.onText(/\/start(.*)/, async (msg, match) => {
  //   const chatId = msg.chat.id;
  //   try {
  //     const addUserToDbStatement =
  //       "INSERT INTO `user`(`id`, `durationPerNotification`, `active`) VALUES (?,?,?)";
  //     const [rows, fields] = await dbConnection.execute(addUserToDbStatement, [
  //       chatId,
  //       3600,
  //       true,
  //     ]);
  //     bot.sendMessage(chatId, "New Subscription Created");
  //   } catch (err) {
  //     if (err.code === "ER_DUP_ENTRY") {
  //       bot.sendMessage(chatId, "Subscription Already Exist!!!");
  //     } else {
  //       console.log(err.code);
  //     }
  //   }
  //   bot.sendMessage(
  //     chatId,
  //     "Add/Remove Pincode by using\n /addPin pinNo1 pinNo2 ... \n /delPin pinNo1 pinNo2 ...\n" +
  //       "By Default Notification will be pushed every 1hr(3600 seconds) if the seats are available"
  //   );
  // });
  // Matches "/echo [whatever]"
  // bot.onText(/\/echo (.+)/, (msg, match) => {
  //   // 'msg' is the received Message from Telegram
  //   // 'match' is the result of executing the regexp above on the text content
  //   // of the message
  //   const chatId = msg.chat.id;
  //   const resp = match[1]; // the captured "whatever"
  //   // send back the matched "whatever" to the chat
  //   bot.sendMessage(chatId, resp);
  // });
  //   bot.on("message", (msg) => {
  //     const chatId = msg.chat.id;
  //     // send a message to the chat acknowledging receipt of their message
  //     console.log(chatId);
  //     console.log(msg);
  //     bot.sendMessage(chatId, msg.text);
  //   });
// };

  // for (const pincode of pincodes.data) {
  //   const chatId = await getCustomersSubcribedToPin(pincode);
  //   const msg = "";
  //   console.log(chatIdtoPincodeMap.data);
  //   // for (const chatPin of chatIdtoPincodeMap.get(chatId)) {
  //   //   console.log(pincodeToDataMap.get(chatPin));
  //   //   msg += jsonToTable(pincodeToDataMap.get(chatPin));
  //   // }
  //   sendNotifcation(chatId.data, msg);
  // }

  // console.log(pincodeToDataMap);

  // helper(pincodeToDataMap);

  // res.send(availableCenters)


// cron.schedule("* * * * *", async () => {
//   const apiUrl = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${pinCode}&date=${date}`;

//   let allCenters = [];
//   let availableCenters = {};
//   try {
//     const response = await got(apiUrl);
//     allCenters = JSON.parse(response.body).centers;
//   } catch (error) {
//     console.log(error.response.body);
//   }

//   allCenters.forEach((center) => {
//     for (const sess of center.sessions) {
//       if (sess.min_age_limit === 18 && sess.available_capacity >= 0) {
//         if (!availableCenters[sess.date]) availableCenters[sess.date] = [];

//         availableCenters[sess.date].push({
//           centerName: center.name,
//           avlSlots: sess.available_capacity,
//           minAgeLimit: sess.min_age_limit,
//           vaccine: sess.vaccine,
//         });
//       }
//     }
//   });

//   let msg = `Availble Slots : \n\n`;
//   Object.keys(availableCenters).forEach(function (key) {
//     msg += `*Date : ${key}* \n`;
//     availableCenters[key].forEach((ses) => {
//       msg += `centerName :\t${ses.centerName}\navlSlots :\t${ses.avlSlots}\nminAgeLimit :\t${ses.minAgeLimit}\nvaccine :\t${ses.vaccine}\n\n`;
//     });
//   });
//   console.log(msg);

//   //   client.messages
//   //     .create({
//   //       from: "whatsapp:+14155238886",
//   //       body: msg,
//   //       to: "whatsapp:+919556193085",
//   //     })
//   //     .then((message) => console.log(message.sid))
//   //     .catch((err) => console.log(err));
//   console.log("running a task every minute");
// });

// app.post("/message", async (req, res, next) => {
//   const twiml = new MessagingResponse();
//   twiml.message(
//     "Thank you for your message! A member of our team will be in touch with you soon."
//   );
//   res.writeHead(200, { "Content-Type": "text/xml" });
//   res.end(twiml.toString());
//   await require("util").promisify(setTimeout)(5000);
//   console.log(req.body.Body);
// });

  // const pinCode = 829114;

  // const availableCenters = await cowinApiHelper(pinCode, date);
  // console.log(availableCenters);
  // const msg = jsonToTable(availableCenters);
  // console.log(msg);
  // whatsappHelper();
  // emailHelper("sachin.storm.sr@gmail.com", msg, date);

  app.get("/", async (req, res) => {


    const chatIdtoPincodeMapResp = await getPinCodesPerChatId();
    const chatIdtoPincodeMap = chatIdtoPincodeMapResp.data;
    const pincodes = await getAllPincodes();
    if (!pincodes.success) {
      console.log(pincodes.error);
    }
    const pincodeToDataMap = await mapPincodeToDataHelper(pincodes.data);
    const customers = await getCustomersSubcribedToPin(829114);
  
    for (const [chatId, pincodes] of chatIdtoPincodeMap.entries()) {
      let msg = "";
      for (const pincode of pincodes) {
        msg += jsonToTable(pincodeToDataMap.get(pincode));
      }
      sendNotifcation(chatId, msg);
    }
  
    res.send("test");
  });

  app.get("/", async (req, res) => {
    console.log("Email Scheduled");
    const date = new Date()
      .toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
    await emailHelper("sachin.storm.sr@gmail.com", "Daily Logs", date);
    res.send("test");
  });

    "start": "pm2 start app.js -l ./server.txt",
