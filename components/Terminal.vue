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
      $ptty: null,
      welcome: `Welcome on my <strong class="blue-text">portfolio</strong>
To start enter the command <strong class="orange-text">help</strong>`,
      error_not_found: `is not a valid command, type <strong class="orange-text">help</strong> for full list with commands.`,
      help: `
<strong class="orange-text">about</strong>          Learn more about me
<strong class="orange-text">portfolio</strong>      Show my work
<strong class="orange-text">skills</strong>         Show my skills
<strong class="orange-text">social</strong>         Display my social network profiles
<strong class="orange-text">contact</strong>        Send me a message`,
      about: `<br /><span class="lightblue-text">I'm Todor Dimov, a 29-year-old <strong class="red-text">Front-end developer</strong> based in Houston, Tx. I'm a weird guy who likes making weird things with web technologies.
I like to <strong class="red-text">resolve</strong> design problems, <strong class="red-text">create</strong> smart user interface and <strong class="red-text">imagine</strong> useful interaction, developing rich web experiences & <strong class="red-text">web applications</strong>.
When not working or futzing around with code, I actually study more code. I'm currently not available for full time <strong class="red-text">projects</strong> but always on the look for side ones.</span>`,
      portfolio: `<br /><a href="#">Delta Hydraulics</a><br /><a href="#">Pelican Insurance</a>`,
      social: `<br />
<strong class="orange-text">github</strong>        <a target="_blank" href="https://github.com/tdrdimov">github.com</a>
<strong class="orange-text">linkedin</strong>      <a target="_blank" href="https://www.linkedin.com/in/todor-dimov-96900b115">linkedin.com</a>
<strong class="orange-text">codepen</strong>       <a target="_blank" href="https://codepen.io/tdrdimov/">codepen.io</a>
<strong class="orange-text">upwork</strong>        <a href="https://www.upwork.com/o/profiles/users/_~012c5b3b4e6acc0bf6/">upwork.com</a>
<strong class="orange-text">instagram</strong>     <a target="_blank" href="https://www.instagram.com/tdrdimov/">instagram.com</a>
type <strong class="orange-text">github</strong> to open my github profile`,
      skills: `<br />
<h3 class="cyan-text">SKILLS</h3>
<strong class="lightblue-text">Development:</strong>
Front-end frameworks
Browser-specific quirks
Performance across devices
Responsive web
Client-side optimization

<strong class="lightblue-text">Design:</strong>
User interface
User experience
Web animation

<h3 class="cyan-text">TOOLS</h3>
<strong class="lightblue-text">Development:</strong>
Javascript <span class="small">es6 / jQuery / React.js / Vue.js / Three.js / Nuxt.js</span>
PHP <span class="small">Wordpress</span>
HTML
CSS <span class="small">SASS / SCSS</span>
Version Control <span class="small">git</span>

<strong class="lightblue-text">Design:</strong>
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
    this.command('social', that.social)
    this.command('skills', that.skills)
    this.command('github', 'open in 1s', 'https://github.com/tdrdimov')
    this.command('linkedin', 'open in 1s', 'https://www.linkedin.com/in/todor-dimov-96900b115')
    this.command('instagram', 'open in 1s', 'https://www.instagram.com/tdrdimov/')
    this.command('codepen', 'open in 1s', 'https://codepen.io/tdrdimov/')
    this.command('upwork', 'open in 1s', 'https://www.upwork.com/o/profiles/users/_~012c5b3b4e6acc0bf6/')
    // Register callback for commands
    this.callback('help')
    this.callback('about')
    this.callback('portfolio')
    this.callback('social')
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
    // Register command
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
    }
  }
}
</script>
