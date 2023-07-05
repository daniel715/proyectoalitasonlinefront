<template>
  <div>
      <v-combobox
        v-model="select"
        :items="items"
        item-value="id"
        item-text="nombre"
        label="Categorias"
        multiple
        chips
        outlined
      ></v-combobox>
  </div>
</template>
  
  <script>
export default {
  data: () => ({
    select: [],
    items: [],
  }),

  methods: {
    async getCategorias() {
      let response = await this.$axios.get('categoria/list')
      console.log(response)
      this.items = response.data
    },
  },
  watch: {
    select(newVal, oldVal) {
      console.log('elemento seleccionado', newVal)
      this.$emit('input', newVal)
    },
  },
  created() {
    this.getCategorias()
  },
}
</script>