import 'dotenv/config';
import nodemailer from 'nodemailer';

async function testMail() {
    console.log('Testing SMTP configuration...');
    console.log('User:', process.env.SMTP_USER);
    console.log('Pass:', process.env.SMTP_PASS ? '***[HIDDEN]***' : 'MISSING');

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    try {
        await transporter.verify();
        console.log('Transporter verification successful. Ready to send emails.');

        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.SMTP_USER,
            subject: 'Test Email',
            text: 'This is a test email.'
        });
        console.log('Test email sent successfully.');
    } catch (error) {
        console.error('Error verifying transporter:', error);
    }
}

testMail();
