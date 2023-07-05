import { mapState } from "vuex";
export default {
  props: {
    max: {
      type: Number,
      default: 10000
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: "Descripción"
    },
    value: {
      type: String / Number,
      default: ""
    },
    col: {
      type: Number / String,
      default: 12
    },
    //indica que el input estará a la izquierda y se dará un padding a la derecha
    left: {
      type: Boolean,
      default: false
    },
    //indica que el input estará a la derecha y se dará un padding a la izquierda
    right: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "text"
    },
    /**deshabilita el input */
    disabled: {
      type: Boolean,
      default: false
    },
    noRequired: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    customRule: {
      type: Function,
      default: null
    },
    /**muestra checkbox en una misma fila */
    isEditable: {
      type: Boolean,
      default: false
    },
    noMarginBottom: {
      type: Boolean,
      default: false
    },
    appendIcon: {
      type: String,
      default: ""
    },
    suffix: {
      type: String,
      default: ""
    },
    nativeRequired: {
      type: Boolean,
      default: false
    },
    classCheckbox: {
      type: String,
      default: "pl-1 pt-1"
    },
    hideDetail: {
      type: Boolean,
      default: false
    },
    leftLabel: {
      type: Boolean,
      default: false
    },
    errorMessages: {
      type: String,
      default: ""
    },
    prependIcon: {
      type: String,
      default: ""
    },
    prependInnerIcon: {
      type: String,
      default: ""
    },
    height: {
      type: String,
      default: ""
    }
  },
  computed: {
    ...mapState({
      isMobile: state => state.app.isMobile
    }),
    model: {
      get() {
        return typeof this.value == "string" ? this.value.trim() : this.value;
      },
      set(value) {
        let temp = typeof value == "string" ? value.trim() : value;
        /* this.$refs.input.lazyValue = temp */
        this.$emit("input", temp);
      }
    }
  },
  data: () => ({
    /* model: "", */
    rulesInput: [],
    editable: false,
    uniqueId: "id"
  }),
  watch: {
    /* model(newVal, oldVal) {
      this.$emit("input", this.model);
    }, */
    /* value(newVal,oldVal){
      this.model = newVal
    } */
    editable(newVal) {
      if (newVal) this.$emit("editActivated");
      else this.$emit("editDisabled");
    },
    noRequired(newVal) {
      const i = this.rulesInput.findIndex(fn => fn.caller.name === "required");
      console.log("prop:norequired; watch", i);
      if (newVal) {
        //si el input no es obligatorio
        if (i >= 0) this.rulesInput.splice(i, 1);
      } else {
        //si el input es obligatorio
        if (i === -1) this.rulesInput.push(this.rules.required);
      }
    }
    /* model(newVal){
      console.log(newVal.length)
      this.model = newVal.trim()
      console.log(this.model.length)
    } */
  },
  methods: {
    onKeypress(evt) {
      let max = this.max - 1;
      this.$emit("keypress", evt);
      if (this.model.length >= max) {
        this.model = this.model.substring(0, max);
      }
    },
    initRules() {
      if (this.type == "email") {
        this.rulesInput.push(this.rules.email);
        this.rulesInput.push(this.rules.emailTrim);
      }
      if (!this.noRequired) this.rulesInput.push(this.rules.required); //si es requerido
    },
    onBlur() {
      this.$refs.input.isResetting = true;
      this.$emit("blur");
      /* if (this.hasError) this.setErrorLabel();
      else this.setBlurLabel(); */
    }
  },
  mounted() {
    /* this.setBlurLabel(); */
    /* this.nativeRequired */
    /* console.log('test input',this.$refs.input.$refs) */
    // deshabilitado 14-06
    /* this.$refs.input.$refs.input.required = true; */
  },
  created() {
    this.model = this.value;
    this.initRules();
    let types = ["date", "time"];
    if (types.includes(this.type)) this.omitFirstError = true; // si el tipo del input es date o time, se omite primer error
  }
};
