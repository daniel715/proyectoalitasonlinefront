<template>
  <div>
    <basic-crud
      ref="basicCrud"
      @onEdit="onEdit"
      @onAdd="onAdd"
      @onDelete="onDelete"
      :headers="headers"
      :entidad="entidad"
      :items="items"
      showDelete
      showEdit
    />
    <add-categoria-dialog @refresh="refresh" ref="addCategoriaDialog" />
  </div>
</template>
<script>
import basicCrud from '@/components/BasicCrud.vue'
import addCategoriaDialog from '@/components/AddDialogs/AddCategoriaDialog.vue'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    basicCrud,
    addCategoriaDialog,
  },
  data: () => ({
    entidad: 'categoria',
    headers: [
      { text: 'Nombre', value: 'nombre' },
      { text: 'Actions', value: 'actions', align: 'end' },
    ],
    items: [],
    editedItem: {},
    editedIndex: '',
  }),
  computed: {
    ...mapGetters(['allCategorias']),
  },
  methods: {
    ...mapActions(['deleteCategoria']),
    onAdd() {
      this.$refs.addCategoriaDialog.dialog = true
    },
    onEdit(item, editedIndex) {
      console.log('editando con data', item)
      this.editedItem = item
      this.editedIndex = editedIndex
      this.setRefs()
      setTimeout(() => {
        this.openDialog()
      }, 100)
    },
    async onDelete(data) {
      let response = await this.deleteCategoria(data)
      console.log(response)
      if (response.status == '204') {
        console.log('eliminado con exito')
        this.items = this.allCategorias
      }
    },
    openDialog() {
      this.$refs.addCategoriaDialog.dialog = true
    },
    setRefs() {
      this.$refs.addCategoriaDialog.editedIndex = this.editedIndex
      this.$refs.addCategoriaDialog.editedItem.idCategoria = this.editedItem.idCategoria
      this.$refs.addCategoriaDialog.editedItem.nombre = this.editedItem.nombre
    },
    refresh() {
      this.items = this.allCategorias
    },
  },
  created() {
    this.items = this.allCategorias
  },
}
</script>