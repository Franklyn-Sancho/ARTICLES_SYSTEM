import * as nodemailer from "nodemailer";

export function sendMailService(email: string, message: string) {
  const smtpTransport = nodemailer.createTransport({
    service: "",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mail = {
    from: "",
    to: email,
    subject: `Bem vindo ao Article_System`,
    text: message,
  };

  return new Promise((resolve, reject) => {
    smtpTransport
      .sendMail(mail)
      .then((response) => {
        smtpTransport.close();
        return resolve(response);
      })
      .catch((error) => {
        smtpTransport.close();
        return reject(error);
      });
  });
}

