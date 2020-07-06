const functions = require('firebase-functions');
const cors = require("cors")({ origin: true });
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tdrdimov@gmail.com',
    pass: 'Tdr9005225602'
  }
});

exports.sendMail = functions.https.onRequest((req, res) => {
  cors(req, res, () => {

    const mailOptions = {
      from: 'Terminal Application <tdrdimov@gmail.com>',
      to: 'tdrdimov@gmail.com',
      subject: req.body.subject ? req.body.subject : 'New email from terminal app',
      html: req.body.message
    };

    // returning result
    return transporter.sendMail(mailOptions, (erro) => {
      if(erro){
        return res.send(erro.toString());
      }
      return res.send('Email sent!');
    });
  });
});
