import nodemailer from 'nodemailer';
import hbs, {
    HbsTransporter,
    NodemailerExpressHandlebarsOptions,
} from 'nodemailer-express-handlebars';
import path from 'path';
import { smtpHost, smtpPassword, smtpUser } from '../../Environment';
import { logError, logInfo } from '../../Logger';

const transporter = nodemailer.createTransport({
    host: smtpHost,
    secure: true,
    auth: { user: smtpUser, pass: smtpPassword },
}) as HbsTransporter;

// point to the template folder
const handlebarOptions: NodemailerExpressHandlebarsOptions = {
    viewEngine: {
        partialsDir: path.resolve('./src/communication/outgoing/templates/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./src/communication/outgoing/templates/'),
};

// use a template file with nodemailer
transporter.use('compile', hbs(handlebarOptions));

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

export const sendHtmlEmail = (
    to: string,
    subject: string,
    template: string,
    params: Record<string, string>,
) => {
    transporter.sendMail({
        from: smtpUser,
        to,
        subject,
        template,
        context: params,
    });
};
