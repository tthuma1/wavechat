import nodemailer from "nodemailer";
require("dotenv").config();

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(to: string, subject: string, html: string) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();
  // console.log("testAccount", testAccount);

  // create reusable transporter object using the default SMTP transport
  // let transporter = nodemailer.createTransport({
  //   host: "smtp.ethereal.email",
  //   port: 587,
  //   secure: false, // true for 465, false for other ports
  //   auth: {
  //     user: "d2lxvyuy5ii5muxj@ethereal.email", // generated ethereal user
  //     pass: "mzqDrcCq1CuJ2Nq5yD", // generated ethereal password
  //   },
  // });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // send mail with defined transport object
  // let info = await transporter.sendMail({
  await transporter.sendMail({
    to: to, // list of receivers
    subject: subject, // Subject line
    html,
  });

  // console.log("Message sent: %s", info.messageId);
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
