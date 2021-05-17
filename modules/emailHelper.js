const { promises: fs } = require("fs");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const emailHelper = async (recipientAddress, msg, date) => {
  pathToAttachment = `logs/server.txt`;
  let attachment = await fs.readFile(pathToAttachment);
  attachment = attachment.toString("base64");

  const emailMsg = {
    to: recipientAddress, // Change to your recipient
    from: "007.sachin.spy@gmail.com", // Change to your verified sender
    subject: `Vaccine Tracker Report - ${date}`,
    text: msg,
    attachments: [
      {
        content: attachment,
        filename: "server.txt",
        type: "application/text",
        disposition: "attachment",
      },
    ],
  };
  try {
    await sgMail.send(emailMsg);
    console.log("Sent");
  } catch (error) {
    console.error(error);
  }
};

module.exports = emailHelper;
