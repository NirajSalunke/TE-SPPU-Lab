import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
let transporter;

export const createTransporter = async() => {
    transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        auth : {
            user : process.env.MAIL_USER,
            pass : process.env.MAIL_PASS
        }});
        console.log("MAIL CONNECTION SUCCESSFULL");
        return transporter;
}  