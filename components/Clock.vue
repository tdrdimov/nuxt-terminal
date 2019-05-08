<template>
  <div>
    <span>{{ date }}</span>
    <p>{{ time }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      week: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
      time: null,
      date: null
    }
  },
  mounted() {
    setInterval(this.updateTime, 1000)
    this.updateTime()
  },
  methods: {
    zeroPadding(num, digit) {
      let zero = ''
      for (let i = 0; i < digit; i++) {
        zero += '0'
      }
      return (zero + num).slice(-digit)
    },
    updateTime() {
      const cd = new Date()
      this.time = this.zeroPadding(cd.getHours(), 2) + ':' + this.zeroPadding(cd.getMinutes(), 2) + ':' + this.zeroPadding(cd.getSeconds(), 2)
      this.date = this.zeroPadding(cd.getFullYear(), 4) + '-' + this.zeroPadding(cd.getMonth() + 1, 2) + '-' + this.zeroPadding(cd.getDate(), 2) + ' ' + this.week[cd.getDay()]
    }
  }
}
</script>
