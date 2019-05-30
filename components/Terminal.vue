<template>
  <div class="container">
    <form id="contact_form" method="post" action="/">
      <input v-model="contactForm.name" type="hidden" name="userName"></input>
      <input v-model="contactForm.email" type="hidden" name="email"></input>
      <textarea id="message" v-model="contactForm.message" name="message" />
    </form>
    <div>
      <canvas id="myCanvas" class="background" />
      <div class="terminalFrame">
        <div class="frame">
          <div class="buttons">
            <div class="close" @click="onSubmit" />
            <div class="minimize" />
            <div class="zoom" />
          </div>
          <span>tdrdimov --bash</span>
        </div>
        <div id="terminal" />
      </div>
      <Clock id="clock" />
    </div>
  </div>
</template>

<script>
import Clock from '~/components/Clock.vue'

/* eslint-env jquery */
export default {
  components: {
    Clock
  },
  data() {
    return {
      contactForm: {
        name: null,
        email: null,
        message: null
      },
      $ptty: null,
      welcome: `Welcome on my <span class="bg-blue">portfolio</span>
To start enter the command <span class="orange-text">help</span>`,
      error_not_found: `is not a valid command, type <span class="orange-text">help</span> for full list with commands.`,
      help: `
<span class="orange-text">about</span>          Learn more about me
<span class="orange-text">portfolio</span>      Show links to my work
<span class="orange-text">skills</span>         Show my skills
<span class="orange-text">socials</span>        Display my social network profiles
<span class="orange-text">contact</span>        Send me a message`,
      about: `<br /><span class="lightblue-text">My name is Todor Dimov, a 29-year-old <span class="green-text">Front-end developer</span> based in Houston, Tx. I'm a weird guy who likes making weird things with web technologies. I like to <span class="green-text">resolve</span> design problems, <span class="green-text">create</span> smart user interface and <span class="green-text">imagine</span> useful interaction, developing rich web experiences & <span class="green-text">web applications</span>.`,
      portfolio: `<br /><a href="#">Delta Hydraulics</a><br /><a href="#">Pelican Insurance</a>`,
      social: `<br />
<span class="orange-text">github</span>        <a target="_blank" href="https://github.com/tdrdimov">github.com</a>
<span class="orange-text">linkedin</span>      <a target="_blank" href="https://www.linkedin.com/in/todor-dimov-96900b115">linkedin.com</a>
<span class="orange-text">codepen</span>       <a target="_blank" href="https://codepen.io/tdrdimov/">codepen.io</a>
<span class="orange-text">upwork</span>        <a href="https://www.upwork.com/o/profiles/users/_~012c5b3b4e6acc0bf6/">upwork.com</a>
<span class="orange-text">instagram</span>     <a target="_blank" href="https://www.instagram.com/tdrdimov/">instagram.com</a>
type <span class="orange-text">github</span> to open my github profile`,
      skills: `<br />
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
Javascript <span class="small">es6 / jQuery / React.js / Vue.js / Three.js / Nuxt.js</span>
PHP <span class="small">Wordpress</span>
HTML
CSS <span class="small">SASS / SCSS</span>
Version Control <span class="small">git</span>

<span class="lightblue-text">Design:</span>
Adobe Photoshop`
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
    // Register typing callback for commands
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
                alert('Please input a valid email!')
                cmd.out = 'Enter your email.'
                cmd.ps = 'Email: '
                cmd.next = 'contact 1'
              }
            } else if (num === 2 && testMail.test(that.contactForm.email)) {
              that.contactForm.message = $input.text()
              cmd.out = `<span class="loading-dots"><span>Sending</span><span class="dot one">.</span><span class="dot two">.</span><span class="dot three">.</span></span>`
              setTimeout(() => {
                that.onSubmit()
                cmd.out = cmd.ps = cmd.next = null
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
            setTimeout(() => { window.open(link) }, 2000)
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
      document.getElementById('contact_form').submit()
    }

  }
}
</script>
