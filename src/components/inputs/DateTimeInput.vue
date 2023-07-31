<template>
  <div class="d-flex flex-row datetime-input">
    <h3>{{ label }}</h3>
    <date-input :value="fecha" @input="setFecha" left :label="dateLabel" current />
    <v-spacer />
    <time-input :value="hora" @input="setHora" right :label="hourLabel" current />
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
    hour: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    fecha: '',
    hora: '',
    date: '',
  }),
  methods: {
    setFecha(data) {
      this.fecha = data
      this.date = this.fecha + ' ' + this.hora
      this.$emit('input', this.date)
    },
    setHora(data) {
      this.hora = data
      this.date = this.fecha + ' ' + this.hora
      this.$emit('input', this.date)
    },
  },
}
</script>
