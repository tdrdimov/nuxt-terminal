const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')

const bodyParser = require('body-parser')
const sgMail = require('@sendgrid/mail')
const mailgun = require('mailgun-js')

const app = express()

app.use(bodyParser.urlencoded({extended:false}))

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

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()

app.post('/', (req, res) => {
  var api_key = 'fc3f1a4d7d46fca62e22f8023d534152-52b0ea77-8de73495';
  var domain = 'sandbox29420065368340e3b89d910c52f16910.mailgun.org';
  var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

  var data = {
    from: `From ${req.body.userName} ${req.body.email}`,
    to: 'tdrdimov@gmail.com',
    subject: 'Msg From Terminal',
    html: `Message: ${req.body.message}`
  };

  mailgun.messages().send(data, function (error, body) {
    console.log(body);
  });
  res.redirect('/')
})
