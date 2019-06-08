var cors = require('cors')
const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')


const bodyParser = require('body-parser')
const mailgun = require('mailgun-js')

const app = express()

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.use((req, res,next) => {
 res.header('Access-Control-Allow-Origin', '*')
 res.header('Access-Control-Allow-Headers', '*')
 if (req.method === 'OPTIONS') {
  res.header('Access-Control-Allow-Method', 'PUT, POST, PATCH, DELETE, GET')
  return res.status(200).json({})
 }
 next()
})

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
    message: `Server listening on http://${host}:${3001}`,
    badge: true
  })
}
start()

app.post('/', (req, res, next) => {
  var api_key = 'fc3f1a4d7d46fca62e22f8023d534152-52b0ea77-8de73495';
  var domain = 'sandbox29420065368340e3b89d910c52f16910.mailgun.org';
  var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

  var data = {
    from: `From ${req.body.userName} <${req.body.email}>`,
    to: 'tdrdimov@gmail.com',
    subject: `Msg From Terminal`,
    text: `Message: ${req.body.message}`
  };

  mailgun.messages().send(data, function (error, body, event) {
    console.log(error, body, event);
  });
  res.redirect('/')
})
