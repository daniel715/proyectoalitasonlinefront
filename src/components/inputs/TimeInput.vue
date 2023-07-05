<template>
  <v-text-field
    :label="label"
    v-model="model"
    :rules="rulesInput"
    type="time"
    @input="model = $event"
    autocomplete="off"
    :disabled="disabled || (isEditable && !editable)"
    :loading="loading"
    @keypress="$emit('keypress', $event)"
    ref="input"
    @blur="onBlur"
    :class="`${isEditable ? 'd-flex flex-row' : ''} ${left && !isMobile ? 'pr-1' : ''} ${
      right && !isMobile ? 'pl-1' : ''
    }`"
    style="width: 94px; max-width: 94px"
  />
</template>

<script>
import { mapState } from 'vuex'
import rules from '@/mixins/rules.mixin'
import dates from '@/mixins/dates.mixin'
export default {
  name: 'TimeInput',
  mixins: [rules, dates],
  props: {
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
    current: {
      type: Boolean,
      default: false,
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
  },
  data: () => ({
    /* model: "", */
    rulesInput: [],
    editable: false,
    uniqueId: 'id',
  }),
  watch: {
    /* model(newVal, oldVal) {
      this.$emit("input", this.model);
    }, */
    /* value(newVal,oldVal){
      this.model = newVal
    } */
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
    /* onFocus() {
      if(this.hasError && this.model!='') this.setErrorLabel()
      else this.setSucessLabel()
    },
    onError(is) {
      console.log('on error',is)
      if(is) this.setErrorLabel()
      else this.setSucessLabel()
    },*/
    onBlur() {
      this.$refs.input.isResetting = true
      this.$emit('blur')
    },
  },
  mounted() {},
  created() {
    this.model = this.value
    this.initRules()
    if (this.current) this.model = this.currentTime
  },
}
</script>

<style lang="scss" scoped>
.custom-text-field {
  padding-top: 2px;
}
</style>