<template>
  <div class="d-flex flex-row datetime-input">
    <h3>{{ label }}</h3>
    <date-input left v-model="dateComputed" :label="dateLabel" current />
    <v-spacer />
    <time-input right v-model="hourComputed" :label="hourLabel" current />
  </div>
</template>

<script>
import dateInput from './DateInput.vue'
import timeInput from './TimeInput.vue'
export default {
  components: {
    dateInput,
    timeInput,
  },
  props: {
    hourLabel: {
      type: String,
      default: 'Hora',
    },
    dateLabel: {
      type: String,
      default: 'Fecha',
    },
    label: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      default: '',
    },
    hour: {
      type: String,
      default: '',
    },
  },
  data: () => ({}),
  computed: {
    dateComputed: {
      get() {
        return this.date
      },
      set(val) {
        this.$emit('date', val)
      },
    },
    hourComputed: {
      get() {
        return this.hour
      },
      set(val) {
        this.$emit('hour', val)
      },
    },
  },
  methods: {
    reset() {
      this.dateComputed = this.$moment().format('YYYY-MM-DD')
      this.hourComputed = this.$moment().format('HH:mm')
    },
  },
}
</script>
