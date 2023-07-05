<template>
    <div>
      <basic-crud
        ref="basicCrud"
        @onEdit="onEdit"
        @getItems="getItems"
        @onAdd="onAdd"
        @onDelete="onDelete"
        :headers="headers"
        :entidad="entidad"
        :items="items"
        showEdit
        showDelete
      />
      <add-categoria-dialog @refresh="refresh" ref="addCategoriaDialog" />
    </div>
  </template>
  <script>
  import basicCrud from '@/components/BasicCrud.vue'
  import addCategoriaDialog from '@/components/AddDialogs/AddCategoriaDialog.vue'
  export default {
    components: {
      basicCrud,
      addCategoriaDialog,
    },
    data: () => ({
      entidad: 'bebidas',
      headers: [
        { text: 'Categoria', value: 'categoria' },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Precio', value: 'precio' },
        { text: 'Actions', value: 'actions', align: 'end' },
      ],
      items:[{
        categoria : 'BEBIDAS',
        nombre : 'INCA KOLA 600ML', 
        precio : 3.5
      }],
      editedItem: {},
      editedIndex: '',
    }),
    methods: {
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
        let response = await this.$axios.delete(this.entidad + '/delete/' + data.id)
        if (response.status == '204') {
          this.refresh()
          console.log('eliminado y actualizado')
        }
      },
      openDialog() {
        this.$refs.addCategoriaDialog.dialog = true
      },
      setRefs() {
        this.$refs.addCategoriaDialog.editedIndex = this.editedIndex
        this.$refs.addCategoriaDialog.nombre = this.editedItem.nombre
        this.$refs.addCategoriaDialog.editedItem.id = this.editedItem.id
      },
      refresh() {
        this.getItems()
      },
      async getItems() {
        let response = await this.$axios.get(this.entidad + '/list')
        console.log(response)
        setTimeout(() => {
          this.$refs.basicCrud.items = response.data
        }, 500)
      },
    },
  }
  </script>