const got = require("got");

const cowinApiHelper = async (pinCode, date) => {
  let allCenters = [];
  let availableCenters = {};
  const apiUrl = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${pinCode}&date=${date}`;

  try {
    const response = await got(apiUrl);
    allCenters = JSON.parse(response.body).centers;
    allCenters.forEach((center) => {
      for (const sess of center.sessions) {
        if (sess.min_age_limit === 18 && sess.available_capacity > 0) {
          if (!availableCenters[sess.date]) availableCenters[sess.date] = [];

          availableCenters[sess.date].push({
            centerName: center.name,
            avlSlots: sess.available_capacity,
            minAgeLimit: sess.min_age_limit,
            vaccine: sess.vaccine,
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
  return availableCenters;
};

const jsonToTable = (availableCenters) => {
  let msg = "";
  Object.keys(availableCenters).forEach(function (key) {
    msg += `*Date : ${key}* \n`;
    availableCenters[key].forEach((ses) => {
      msg += `centerName :\t${ses.centerName}\navlSlots :\t${ses.avlSlots}\nminAgeLimit :\t${ses.minAgeLimit}\nvaccine :\t${ses.vaccine}\n\n`;
    });
  });
  return msg;
};

const mapPincodeToDataHelper = async (pincodes) => {
  const date = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const pincodeToDataMap = new Map();
  for (const pincode of pincodes) {
    const tempData = await cowinApiHelper(pincode, date);
    pincodeToDataMap.set(pincode, tempData);
  }
  return pincodeToDataMap;
};

module.exports = { cowinApiHelper, jsonToTable, mapPincodeToDataHelper };
