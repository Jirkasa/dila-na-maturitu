const nodemailer = require('nodemailer');
// const sendinBlue = require('nodemailer-sendinblue-transport');

const transporter = nodemailer.createTransport({
    service: "SendinBlue",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_KEY
    }
});
// const transporter = nodemailer.createTransport(sendinBlue({
//     apiKey: process.env.SMTP_KEY
// }));


function sendVerificationEmail(email, verificationToken) {
    return transporter.sendMail({
        from: "overeni@dila-na-maturitu.cz",
        to: email,
        subject: "Ověření účtu na webu Díla na maturitu",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
            <title>Díla na maturitu - ověření účtu</title>
        </head>
        <body>
            <div style="font-family: 'Open Sans', sans-serif; padding: 16px; background-color: #fff; text-align: center;">
                <h1 style="font-size: 24px; margin: 0; margin-bottom: 8px; text-transform: uppercase; color: #322E2D;">Ověření účtu</h1>
                <hr style="border: none; height: 4px; margin: 0; margin-bottom: 8px; background-color: #EBE4E3;">
                <p style="font-size: 16px; line-height: 24px; color: #726A69; margin-bottom: 16px;">Tvoje registrace na webu Díla na maturitu proběhla úspěšně. Teď již je jen potřeba ověřit tvůj email kliknutím na následující odkaz.</p>
                <a href="${process.env.SERVER_URL}/overeni-emailu/${verificationToken}" style="display: inline-block; padding: 8px 16px; font-size: 16px; border-radius: 2px; background-color: #E65950; color: #fff; text-transform: uppercase; text-decoration: none;">Ověřit účet</a>
            </div>
        </body>
        </html>
        `
    });
}

module.exports = {
    sendVerificationEmail
}