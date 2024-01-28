import nodemailer from 'nodemailer';
import { smtpHost, smtpPassword, smtpUser } from '../../Environment';
import { logError, logInfo } from '../../Logger';

const transporter = nodemailer.createTransport({
    host: smtpHost,
    secure: true,
    auth: { user: smtpUser, pass: smtpPassword },
});

transporter.verify((error) => {
    if (error) {
        logError(error.message);
    } else {
        logInfo('SMTP connection verified');
    }
});

export const sendEmail = (to: string, subject: string, content: string) => {
    transporter.sendMail(
        {
            from: smtpUser,
            to,
            subject: subject,
            text: content,
        },
        (err) => {
            if (err) {
                logError(`Unable to send email ${err.message}`);
            }
        },
    );
};
