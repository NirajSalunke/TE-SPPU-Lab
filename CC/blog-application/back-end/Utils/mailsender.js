import dotenv from 'dotenv'
dotenv.config()
import { createTransporter } from '../Config/mailconfig.js'

let transporterPromise = createTransporter();

export const sendMail = async (email , title ,body) => {
    try {
        const transporter = await transporterPromise;
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: title,
            html: body,
        };

        let mailResponse = await transporter.sendMail(mailOptions);
        console.log("MAIL RESPONSE", mailResponse);

    } catch (err) {
        console.error("Something went wrong while generating mail", err);
            
    }
};
