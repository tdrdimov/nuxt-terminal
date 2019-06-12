const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const bodyParser = require('body-parser')
const path = require("path")

const nodemailer = require("nodemailer")

const api_key = '062e8fd4bcfd7fa10b627e9b04a0e846-16ffd509-6e41259a';
const domain = 'sandbox91f0f544e7eb4e989df4f2fa82cc21f6.mailgun.org';
const mailgun = require('mailgun-js')({apiKey: api_key, domain: domain})

const urlencodedParser = bodyParser.urlencoded( { extended:false } )

const app = express()
app.use(urlencodedParser)
app.use(bodyParser.json())

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

  app.get('/createRoute', function(req, res) {
     // .. your reconizalbe response here ..
   res.send("Oops I did a GET, but wanted to POST");
  })

  app.post('/submit', (req, res) => {
    console.log('got here with ' + JSON.stringify(req.body));
    var data = {
         from: `From ${req.body.userName} <todr@bigblablop.com>`,
         to: 'tdrdimov@gmail.com',
         subject: `Msg From Terminal`,
         text: `Message: ${req.body.message}`
       }

       mailgun.messages().send(data, function (error, body) {
         console.log('body:' + body, 'error: ' + error)
         if(!error)
           console.log('Mail Sent!')
         else
           console.log('Mail Not Sent!')
       })
  });

  // Give nuxt middleware to express
  app.use(nuxt.render)

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

// app.post('/submit', (req, res, next) => {
//  var data = {
//      from: `From ${req.body.userName} <${req.body.email}>`,
//      to: 'tdrdimov@gmail.com',
//      subject: `Msg From Terminal`,
//      text: `Message: ${req.body.message}`
//    }
//
//    mailgun.messages().send(data, function (error, body) {
//      console.log('body:' + body, 'error: ' + error)
//      if(!error)
//        console.log('Mail Sent!')
//      else
//        console.log('Mail Not Sent!')
//    })
//
// })

start()
