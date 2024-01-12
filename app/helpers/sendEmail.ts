import nodemailer from "nodemailer";
import { appConfig } from "../config/app";

export const sendEmail = async (
  emailTo: string,
  message: any,
  subject: string,
) => {

  console.log(appConfig.mailerUsernmae, appConfig.mailerPassword, appConfig.mailerService);

  const transporter = nodemailer.createTransport({
    service: appConfig.mailerService,
    auth: {
      user: appConfig.mailerUsernmae,
      pass: appConfig.mailerPassword,
    },
  });

  const mailOptions = {
    from: appConfig.mailerUsernmae,
    to: emailTo,
    subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email reminder sent to ${emailTo} successfully`);
  } catch (error) {
    console.log(transporter);
    console.error("Error sending email", error);
    console.log(appConfig.mailerUsernmae)
  }
};