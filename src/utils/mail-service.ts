import * as nodemailer from "nodemailer"
import { envCongig } from "src/config/env.congig";

export async function sendMail(user: string, message: string) {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        host: envCongig.mail.host,
        port: 465,
        auth: {
            user: envCongig.mail.user,
            pass: envCongig.mail.password
        }
    })

    let mailOptions = {
        from: envCongig.mail.user,
        to: user,
        subject: "erp system",
        text: message
    }

    let res = await transporter.sendMail(mailOptions)
    return res
}