<template>
  <div :class="`${leftLabel ? 'd-flex flex-row align-center' : ''} date-inputt`">
    <label v-if="leftLabel" :class="`v-label ${isDark ? 'theme--dark' : 'theme--light'}`">{{ label }}</label>
    <v-text-field
      :label="labelComputed"
      v-model="model"
      :rules="rulesInput"
      :autofocus="autofocus"
      type="date"
      @input="model = $event"
      :disabled="disabled || (isEditable && !editable)"
      :loading="loading"
      @keypress="$emit('keypress', $event)"
      ref="input"
      @blur="onBlur"
      :style="`width: ${width};max-width:${width};`"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import rules from '@/mixins/rules.mixin'
import dates from '@/mixins/dates.mixin'
import inputs from '@/mixins/inputs.mixin'
export default {
  name: 'DateInput',
  mixins: [rules, dates, inputs],
  props: {
    classInput: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    value: {
      type: String / Number,
      default: '',
    },
    col: {
      type: Number / String,
      default: 12,
    },
    //indica que el input estará a la izquierda y se dará un padding a la derecha
    left: {
      type: Boolean,
      default: false,
    },
    //indica que el input estará a la derecha y se dará un padding a la izquierda
    right: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'text',
    },
    /**deshabilita el input */
    disabled: {
      type: Boolean,
      default: false,
    },
    noRequired: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    customRule: {
      type: Function,
      default: null,
    },
    /**muestra checkbox en una misma fila */
    isEditable: {
      type: Boolean,
      default: false,
    },
    /**
     * setea el valor con la fecha actual
     */
    current: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: '126px',
    },
  },
  computed: {
    ...mapState({
      isMobile: (state) => state.app.isMobile,
    }),
    model: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
    labelComputed() {
      return this.leftLabel ? '' : this.label
    },
  },
  data: () => ({
    /* model: "", */
    rulesInput: [],
    editable: false,
    uniqueId: 'id',
  }),
  watch: {
    model(newVal, oldVal) {
      this.$emit('input', this.model)
    },
    value(newVal, oldVal) {
      this.model = newVal
    },
    editable(newVal) {
      if (newVal) this.$emit('editActivated')
      else this.$emit('editDisabled')
    },
  },
  methods: {
    initRules() {
      if (this.type == 'email') this.rulesInput.push(this.rules.email)
      if (!this.noRequired) this.rulesInput.push(this.rules.required) //si es requerido
    },
    /**
     * establece fecha actual
     */
    initCurrent() {
      if (this.current) this.model = this.currentDate
    },
    onBlur() {
      // this.$refs.input.isResetting = true
      this.$emit('blur')
    },
  },
  created() {
    this.model = this.value
    this.initRules()
    this.initCurrent()
  },
}
</script>

<style lang="scss" scoped>
.custom-text-field {
  padding-top: 2px;
}
</style>
