const express = require('express')
const cors = require('cors')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const bodyParser = require('body-parser')
const path = require("path")

const nodemailer = require("nodemailer");

const api_key = 'fc3f1a4d7d46fca62e22f8023d534152-52b0ea77-8de73495';
const domain = 'sandbox29420065368340e3b89d910c52f16910.mailgun.org';
const mailgun = require('mailgun-js')({apiKey: api_key, domain: domain})

const urlencodedParser = bodyParser.urlencoded( { extended:false } )

const app = express()
app.use(cors())
app.use(urlencodedParser)

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()

app.post('/', (req, res, ) => {

 async function main() {

   // Generate test SMTP service account from ethereal.email
   // Only needed if you don't have a real mail account for testing
   let testAccount = await nodemailer.createTestAccount();

   // create reusable transporter object using the default SMTP transport
   let transporter = nodemailer.createTransport({
     host: "smtp.mailgun.org",
     port: 587,
     secure: false, // true for 465, false for other ports
     auth: {
       user: 'postmaster@sandbox29420065368340e3b89d910c52f16910.mailgun.org',
       pass: '87c24fd580d56265389044d109052d75-52b0ea77-b351d3d8'
     }
   });

   // send mail with defined transport object
   let info = await transporter.sendMail({
     from: `From ${req.body.userName} <${req.body.email}>`,
     to: 'tdrdimov@gmail.com',
     subject: `Msg From Terminal`,
     text: `Message: ${req.body.message}`
   });

   console.log("Message sent: %s", info.messageId);
   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

   // Preview only available when sending through an Ethereal account
   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
 }

main().catch(console.error);
res.redirect('/')

})
