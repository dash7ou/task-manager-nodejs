const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// sgMail.send({
//   to: "fxfddfno@gmail.com",
//   from: "dashishere@gmail.com",
//   subject: "This is my first email app",
//   text: "I hope you get this first message and thank you bro :)"
// });

function sendWelcomeEmail(email, name) {
  sgMail.send({
    to: email,
    from: "support@chatfortoy.com",
    subject: "Welcome to our app chat and get the tasks",
    text: `welcome MS.${name}I hope you be pleased with our application we protect you we are noone :)`
  });
}

function sendDeleteEmail(email, name) {
  sgMail.send({
    to: email,
    from: "support@chatfortoy.com",
    subject: "Sorry to see you go!",
    text: `Goodbye, ${name}. I hope to see you back someTime soon. and you can send you feedback to our support `
  });
}
exports.sendWelcomeEmail = sendWelcomeEmail;
exports.sendDeleteEmail = sendDeleteEmail;
