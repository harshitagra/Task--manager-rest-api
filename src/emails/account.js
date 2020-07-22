const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'harshitagarwal935@gmail.com',
        subject: 'Welcome to Task Manager.',
        text: `hello $(name). Hope u find it interesting`
    })
}
const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'harshitagarwal935@gmail.com',
        subject: 'Sorry to see u go',
        text: `GoodBye $(name). Hope to see u soon.`
    })
}
module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}