const dbConnection = require("./db");

const getAllPincodes = async () => {
  try {
    const getAllPincodesStatement = "SELECT DISTINCT(`pincode`) FROM `pincode`";
    const [rows, fields] = await dbConnection.execute(getAllPincodesStatement);
    let pincodes = rows.map(({ pincode }) => pincode);
    return { success: true, data: pincodes, error: "" };
  } catch (err) {
    return { success: false, data: [], error: err };
  }
};

const getCustomersSubcribedToPin = async (pincode) => {
  try {
    let getAllCustomerIdStatement =
      "SELECT DISTINCT(chatId) FROM pincode p INNER JOIN user u on u.id = p.chatId WHERE p.pincode = ? and u.active = 1";
    const [rows, fields] = await dbConnection.execute(
      getAllCustomerIdStatement,
      [pincode]
    );
    let chatId = rows.map(({ chatId }) => chatId);
    return { success: true, data: chatId, error: "" };
  } catch (err) {
    return { success: false, data: [], error: err };
  }
};

const getPinCodesPerChatId = async () => {
  try {
    const chatIdtoPincodeMap = new Map();
    // SELECT id FROM user where active = 1 and  ( UNIX_TIMESTAMP(SYSDATE()) - UNIX_TIMESTAMP(lastNotificationTime))  >= 1200
    const getUsetSt =
      "SELECT id FROM user where active = 1 and ( UNIX_TIMESTAMP(SYSDATE()) - UNIX_TIMESTAMP(lastNotificationTime)) >= 3600";
    const [rows, fields] = await dbConnection.execute(getUsetSt);
    let ids = rows.map(({ id }) => id);
    for (const id of ids) {
      const getPincodeSt = "SELECT pincode FROM pincode where chatId = ?";
      const [rows2, fields2] = await dbConnection.execute(getPincodeSt, [id]);
      let pincodes = rows2.map(({ pincode }) => pincode);
      chatIdtoPincodeMap.set(id, pincodes);
    }

    return { success: true, data: chatIdtoPincodeMap, error: "" };
  } catch (err) {
    console.log(err);
    return { success: false, data: new Map(), error: err };
  }
};

const addPincodes = async (chatId, pincodes) => {
  let addPincodesToDbStatement =
    "INSERT INTO `pincode`( `pincode`, `chatId`) VALUES ";
  const pincodesWithChatID = [];
  for (const pincode of pincodes) {
    pincodesWithChatID.push(pincode, chatId);
    addPincodesToDbStatement += "(?, ?), ";
  }
  addPincodesToDbStatement = addPincodesToDbStatement.slice(0, -2);

  try {
    const [rows, fields] = await dbConnection.execute(
      addPincodesToDbStatement,
      pincodesWithChatID
    );
    return true;
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return true;
    } else {
      console.log(err.code);
      return false;
    }
  }
};
const delPincodes = async (chatId) => {
  let delPincodesToDbStatement = "DELETE FROM `pincode` WHERE `chatId` = ?";

  try {
    await dbConnection.execute(delPincodesToDbStatement, [chatId]);
    return true;
  } catch (err) {
    return false;
  }
};

const allPincodesbyChatId = async (chatId) => {
  let queryPincodesSt = "SELECT `pincode` FROM `pincode` WHERE`chatId` = ?";
  try {
    const [rows, fields] = await dbConnection.execute(queryPincodesSt, [
      chatId,
    ]);
    let pincodes = rows.map(({ pincode }) => pincode);
    return { success: true, data: pincodes, error: "" };
  } catch (err) {
    return { success: false, data: [], error: err };
  }
};

module.exports = {
  getAllPincodes,
  getCustomersSubcribedToPin,
  getPinCodesPerChatId,
  addPincodes,
  delPincodes,
  allPincodesbyChatId,
};
