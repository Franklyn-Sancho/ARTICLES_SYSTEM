/* import {Transporter, createTransport, createTestAccount, getTestMessageUrl} from "nodemailer";
import {readFileSync} from "fs"
import Handlebars = require("handlebars");

class SendMailService {
  private client: Transporter;
  constructor() {
    createTestAccount().then((account) => {
      const transporter = createTransport({
        host: "",
        port: 0,
        secure: "",
        auth: {
          user: "",
          pass: "",
        },
      });

      this.client = transporter;
    });
  }

  async execute(to: string, subject: string, variables: object, path: string) {
    const templateFileContent = readFileSync(path).toString("utf8")

    const mailTemplateParse = Handlebars.compile(templateFileContent)

    const html = mailTemplateParse(variables)

    const message = await this.client.sendMail({
      to,
      subject,
      html,
      from: "NPS <>",
    });

    console.log("Message sent: %s", message.messageId);
    console.log("preview URL: %s", getTestMessageUrl(message));
  }
}

export default new SendMailService() */
