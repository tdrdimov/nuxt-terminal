<template>
  <div class="container">
    <div>
      <canvas id="myCanvas" class="background" />
      <div class="terminalFrame">
        <div class="frame">
          <div class="buttons">
            <div class="close" />
            <div class="minimize" />
            <div class="zoom" />
          </div>
          <span>dvlpr --zsh</span>
        </div>
        <div id="terminal" />
      </div>
      <Clock id="clock" />
    </div>
    <v-snackbar v-model="snackbar" :timeout="timeout" right top>
      <span :class="snackColor">{{ snackText }}</span>
      <v-btn @click="snackbar = false" flat>
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import axios from 'axios'
import Clock from '~/components/Clock.vue'

/* eslint-env jquery */
export default {
  components: {
    Clock
  },
  data() {
    return {
      snackbar: false,
      timeout: 6000,
      snackText: null,
      snackColor: null,
      contactForm: {
        name: null,
        email: null,
        message: null
      },
      $ptty: null,
      welcome: `Welcome on my <span class="bg-blue">portfolio</span>
Type <span class="orange-text">help</span> to see list with commands`,
      error_not_found: `<span class="red-text">is not a valid command!</span>
Type <span class="orange-text">help</span> to see list with commands.`,
      help: `
<span class="orange-text">about</span>          learn more about me
<span class="orange-text">portfolio</span>      see some of my work
<span class="orange-text">skills</span>         learn more about my skills
<span class="orange-text">socials</span>        connect with me
<span class="orange-text">contact</span>        send me a message`,
      about: `
<span class="lightblue-text">Hi, I'm Todor Dimov, ${(new Date()).getFullYear() - 1990} year old, working as a full time <span class="green-text">Front-end developer,</span> living in Houston, Tx. I can help you solve a problem, build a product or grow existing project. I like to <span class="green-text">resolve</span> design problems, <span class="green-text">create</span> smart user interface and <span class="green-text">useful interaction</span>, developing rich web applications & <span class="green-text">seamless web experiences</span>.`,
      portfolio: `
<span class="green-text">Note: some of these projects are not my designs, just the code.</span>
<span>Type <span class="orange-text">open_1</span> or click on the project name to visit the site/app.</span><br />
<span class="orange-text">1</span>   <a href="https://fitnhealthy.us" target="_blank">Fit & Healthy</a>
<span class="orange-text">2</span>   <a href="https://www.pelican-insurance.com" target="_blank">Pelican Insurance</a>
<span class="orange-text">3</span>   <a href="https://www.clearlake-specialties.com/" target="_blank">ClearLake Specialties</a>
<span class="orange-text">4</span>   <a href="https://www.wagonway.com/" target="_blank">Wagonway</a>
<span class="orange-text">5</span>   <a href="https://www.houstonterminal.com/" target="_blank">Houston Terminal</a>
<span class="orange-text">6</span>   <a href="https://www.coden.com/" target="_blank">Coden</a>
<span class="orange-text">7</span>   <a href="http://www.tasrealtygroup.com/" target="_blank">Tas Realty Group</a>
<span class="orange-text">8</span>   <a href="https://www.ieap.com/" target="_blank">IEAP</a>`,
      social: `
Type <span class="orange-text">github</span> or click on the name to visit my profile.<br />
<span class="orange-text">github</span>        <a target="_blank" href="https://github.com/tdrdimov">github.com</a>
<span class="orange-text">linkedin</span>      <a target="_blank" href="https://www.linkedin.com/in/todor-dimov-96900b115">linkedin.com</a>
<span class="orange-text">instagram</span>     <a target="_blank" href="https://www.instagram.com/tdrdimov/">instagram.com</a>`,
      skills: `
<h3 class="cyan-text">SKILLS</h3>
<span class="lightblue-text">Development:</span>
Front-end frameworks
Browser-specific quirks
Performance across devices
Responsive web
Client-side optimization

<span class="lightblue-text">Design:</span>
User interface
User experience
Web animation

<h3 class="cyan-text">TOOLS</h3>
<span class="lightblue-text">Development:</span>
Javascript <span class="small">ES6 / jQuery / Vue.js / React.js / Three.js / Nuxt.js</span>
PHP <span class="small">Wordpress</span>
HTML <span class="small">Bootstrap, Material Design</span>
CSS <span class="small">SASS / SCSS</span>
Version Control <span class="small">git</span>
Database <span class="small">Firebase - Firestore</span>

<span class="lightblue-text">Design:</span>
Adobe Photoshop
Figma`
    }
  },
  mounted() {
    // Assign ptty
    let pity = this.$ptty
    const that = this
    pity = $('#terminal').Ptty({
      theme: 'fallout',
      i18n: {
        welcome: that.welcome,
        error_not_found: that.error_not_found
      },
      native_cmds: false
    })
    this.$ptty = pity

    const atts = {
      autocapitalize: 'off',
      autocomplete: 'off',
      spellcheck: 'false',
      autocorrect: 'off'
    }
    $('.input').attr(atts)

    // Contact success message
    const successMsg = localStorage.getItem('messageSent')
    if (successMsg) {
      that.snackbar = true
      that.snackText = successMsg
      that.snackColor = 'white-text'
      localStorage.removeItem('messageSent')
    }

    // Register commands
    this.command('help', that.help)
    this.command('about', that.about)
    this.command('portfolio', that.portfolio)
    this.command('socials', that.social)
    this.command('skills', that.skills)
    this.contact() // contact command
    this.command('github', '<span class="loading-dots"><span>Opens in 1s</span><span class="dot one">.</span><span class="dot two">.</span><span class="dot three">.</span></span>', 'https://github.com/tdrdimov')
    this.command('linkedin', '<span class="loading-dots"><span>Opens in 1s</span><span class="dot one">.</span><span class="dot two">.</span><span class="dot three">.</span></span>', 'https://www.linkedin.com/in/todor-dimov-96900b115')
    this.command('instagram', '<span class="loading-dots"><span>Opens in 1s</span><span class="dot one">.</span><span class="dot two">.</span><span class="dot three">.</span></span>', 'https://www.instagram.com/tdrdimov/')
    this.command('codepen', '<span class="loading-dots"><span>Opens in 1s</span><span class="dot one">.</span><span class="dot two">.</span><span class="dot three">.</span></span>', 'https://codepen.io/tdrdimov/')
    this.command('upwork', '<span class="loading-dots"><span>Opens in 1s</span><span class="dot one">.</span><span class="dot two">.</span><span class="dot three">.</span></span>', 'https://www.upwork.com/o/profiles/users/_~012c5b3b4e6acc0bf6/')

    // Projects information commands
    this.command('open_1', '<span class="loading-dots"><span>Loading</span><span class="dot one">.</span><span class="dot two">.</span><span class="dot three">.</span></span>', 'https://fitnhealthy.us/')
    this.command('open_2', '<span class="loading-dots"><span>Loading</span><span class="dot one">.</span><span class="dot two">.</span><span class="dot three">.</span></span>', 'https://www.pelican-insurance.com/')
    this.command('open_3', '<span class="loading-dots"><span>Loading</span><span class="dot one">.</span><span class="dot two">.</span><span class="dot three">.</span></span>', 'https://www.clearlake-specialties.com/')
    this.command('open_4', '<span class="loading-dots"><span>Loading</span><span class="dot one">.</span><span class="dot two">.</span><span class="dot three">.</span></span>', 'https://www.wagonway.com/')
    this.command('open_5', '<span class="loading-dots"><span>Loading</span><span class="dot one">.</span><span class="dot two">.</span><span class="dot three">.</span></span>', 'https://www.houstonterminal.com/')
    this.command('open_6', '<span class="loading-dots"><span>Loading</span><span class="dot one">.</span><span class="dot two">.</span><span class="dot three">.</span></span>', 'https://www.coden.com/')
    this.command('open_7', '<span class="loading-dots"><span>Loading</span><span class="dot one">.</span><span class="dot two">.</span><span class="dot three">.</span></span>', 'http://www.tasrealtygroup.com/')
    this.command('open_8', '<span class="loading-dots"><span>Loading</span><span class="dot one">.</span><span class="dot two">.</span><span class="dot three">.</span></span>', 'https://www.ieap.com/')
    // Register typing callback for commands
    this.callback('open_1')
    this.callback('open_2')
    this.callback('open_3')
    this.callback('open_4')
    this.callback('open_5')
    this.callback('open_6')
    this.callback('open_7')
    this.callback('open_8')
    // End of project related commands
    this.callback('help')
    this.callback('about')
    this.callback('portfolio')
    this.callback('socials')
    this.callback('skills')
    this.callback('github')
    this.callback('linkedin')
    this.callback('instagram')
    this.callback('codepen')
    this.callback('upwork')

    // MATRIX ANIMATION
    canvasApp()
    function canvasSupport(e) {
      return !!e.getContext
    }
    function canvasApp() {
      const canvas = document.getElementById('myCanvas')
      // eslint-disable-next-line
      if (!canvasSupport(myCanvas)) {
        return
      }
      const ctx = canvas.getContext('2d')
      const w = canvas.width = window.innerWidth
      const h = canvas.height = window.innerHeight
      const yPositions = Array(275).join(0).split('')
      function runMatrix() {
        // eslint-disable-next-line
        if (typeof GameInterval !== 'undefined')clearInterval(GameInterval)
        const GameInterval = setInterval(drawScreen, 85)
      }
      function drawScreen() {
        ctx.fillStyle = 'rgba(02, 02, 02, 0.09)'
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#00cc5e'
        ctx.font = '8px Georgia'
        yPositions.map(function (y, index) {
          const text = String.fromCharCode(100 + Math.random() * 33)
          const x = (index * 10)
          ctx.fillText(text, x, y)
          if (y > 100 + Math.random() * 30000) {
            yPositions[index] = 0
          } else {
            yPositions[index] = y + 10
          }
        }
        )
      }
      runMatrix()
    }
  },
  methods: {
    // Register contact command
    contact() {
      const pity = this.$ptty
      const that = this
      pity.register('command', {
        name: 'contact',
        method: function (cmd) {
          const $input = pity.get_terminal('.prompt .input')
          const testMail = /(.+)@(.+){2,}\.(.+){2,}/
          if (that.contactForm.name === null) {
            cmd.out = 'Enter your name.'
            cmd.ps = 'Name: '
          }
          cmd.next = 'contact 0'
          if (cmd[1]) {
            const num = parseInt(cmd[1], 10)
            cmd.next = 'contact ' + (num + 1)
            if (num === 0) {
              cmd.out = 'Enter your email.'
              cmd.ps = 'Email: '
              that.contactForm.name = $input.text()
            } else if (num === 1) {
              if (testMail.test($input.text())) {
                cmd.out = 'Enter your message.'
                cmd.ps = 'Message: '
                that.contactForm.email = $input.text()
              } else {
                that.snackbar = true
                that.snackText = 'PLEASE INPUT VALID EMAIL!'
                that.snackColor = 'red-text'
                cmd.out = 'Enter your email.'
                cmd.ps = 'Email: '
                cmd.next = 'contact 1'
              }
            } else if (num === 2 && testMail.test(that.contactForm.email)) {
              that.contactForm.message = $input.text()
              cmd.out = '<span class="loading-dots"><span>Sending</span><span class="dot one">.</span><span class="dot two">.</span><span class="dot three">.</span></span>'
              setTimeout(() => {
                that.onSubmit()
                cmd.out = cmd.ps = cmd.next = null
                localStorage.setItem('messageSent', 'Thank you for contacting me! I will get back to you shortly!')
              }, 3000)
            }
          }
          pity.set_command_option(cmd)
          return false
        },
        options: [1]
      })
    },
    // Register command generator
    command(name, type, link) {
      const pity = this.$ptty
      pity.register('command', {
        name: name,
        method: function (cmd) {
          const txt = pity.get_command_option('last').split(' ')
          txt.shift()
          let toType = txt.join(' ')
          if (toType === '') {
            toType = type
          }
          if (link !== undefined) {
            setTimeout(() => { window.open(link) }, 3000)
          }
          cmd.data = { type: toType }
          return cmd
        }
      })
    },
    // Generate callback with typing
    callback(name) {
      const pity = this.$ptty
      pity.register('callback', {
        name: name,
        method: this.typing
      })
    },
    focus() {
      setTimeout(function () { // force focus after typing finish
        $('#terminal').click()
        $('#terminal').focus()
        console.log('focus on terminal')
      }, 0)
    },
    // Typing animation
    typing(cmd) {
      const pity = this.$ptty
      const that = this
      const textInput = pity.get_terminal('.prompt')

      if (cmd.data && cmd.data.type && typeof cmd.data.type === 'string') {
        textInput.hide()
        // Decode special entities.
        const str = $('<div>').html(cmd.data.type + ' ').html()

        // Append
        if (!$('.content div .cmd_out:last').length) {
          $('<div><div class="cmd_out"></div></div>').appendTo('.content')
        }
        const typebox = $('<span></span>').appendTo('.content .cmd_out:last')

        // Type string out
        let i = 0
        let isTag
        let text
        (function typewriter() {
          text = str.slice(0, ++i)
          if (text === str) {
            textInput.show()
            pity.echo()
            that.focus()
            return
          }

          typebox.html(text)
          pity.echo() // force scroll to bottom

          const char = text.slice(-1)
          if (char === '<') isTag = true
          if (char === '>') isTag = false

          if (isTag) return typewriter()
          setTimeout(typewriter, 10)
        }())
      }
    },
    // Submit contact hidden form
    onSubmit() {
      const email = {
        message: `Msg from ${this.contactForm.email}<br /><strong>Message</strong>: ${this.contactForm.message}`
      }
      axios.post('https://us-central1-terminal-e8d5f.cloudfunctions.net/sendMail', email).then((res) => {
        console.log(res)
        setTimeout(() => {
          window.location.reload(true)
        }, 2000)
      })
    }

  }
}
</script>
