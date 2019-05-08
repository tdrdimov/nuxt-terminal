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
        </div>
        <Clock id="clock" />
        <div id="terminal" />
      </div>
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
<strong class="orange-text">contact</strong>        To send me a message`,
      about: `<br /><span class="white-text">Hi there,</span>
<span class="white-text">my name is Todor Dimov, a passionate front-end developer with over three years of experience in web & application development. I focus on developing a better user interface and interactions for better user experience.</span>`,
      portfolio: `<br /><a href="#">Delta Hydraulics</a><br /><a href="#">Pelican Insurance</a>`,
      social: `<br />
Github        <a target="_blank" href="https://github.com/tdrdimov">https://github.com/tdrdimov</a>
LinkedIn      <a target="_blank" href="https://www.linkedin.com/in/todor-dimov-96900b115">https://www.linkedin.com/in/todor-dimov-96900b115</a>
Instagram     <a target="_blank" href="https://www.instagram.com/tdrdimov/">https://www.instagram.com/tdrdimov/</a>
type <strong class="orange-text">social github</strong> to open my github profile`
    }
  },
  mounted() {
    // Assign ptty
    let pity = this.$ptty
    const that = this
    pity = $('#terminal').Ptty({
      theme: 'fallout',
      i18n: {
        welcome: that.welcome
      },
      native_cmds: false
    })
    this.$ptty = pity

    // Register commands
    this.command('help', that.help)
    this.command('about', that.about)
    this.command('portfolio', that.portfolio)
    this.command('social', that.social)
    this.command('github', 'open in 1s', 'https://github.com/tdrdimov')
    // Register callback for commands
    this.callback('help')
    this.callback('about')
    this.callback('portfolio')
    this.callback('social')
    this.callback('github')

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
