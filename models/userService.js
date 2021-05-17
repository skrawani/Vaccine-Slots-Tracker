const dbConnection = require("../models/db");

const addUser = async (chatId, durationPerNotification, active) => {
  try {
    const addUserToDbStatement =
      "INSERT INTO `user`(`id`, `durationPerNotification`, `active`) VALUES (?,?,?) ON DUPLICATE KEY UPDATE `active` = true ";
    const [rows, fields] = await dbConnection.execute(addUserToDbStatement, [
      chatId,
      durationPerNotification,
      active,
    ]);
    return true;
  } catch (err) {
    if (err.code != "ER_DUP_ENTRY") {
      console.log("err", err);
      return false;
    }
  }
  return true;
};

const deleteUser = async (chatId) => {
  try {
    const delUserFromDbStatement = "UPDATE `user` SET `active`= ? WHERE id = ?";
    await dbConnection.execute(delUserFromDbStatement, [false, chatId]);
    return true;
  } catch (err) {
    console.log(err);
  }
  return false;
};

module.exports = { addUser, deleteUser };
