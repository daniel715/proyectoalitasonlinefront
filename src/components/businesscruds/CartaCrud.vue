<template>
  <div>
    <basic-crud
      ref="basicCrud"
      @onEdit="onEdit"
      @onAdd="onAdd"
      @onDelete="deleteItem"
      :headers="headers"
      :entidad="entidad"
      :items="items"
      showDelete
      showEdit
    />
    <add-dialog @closeDialog="onCloseDialog" ref="addDialog" entidad="Menu">
      <template v-slot:body>
        <combo
          label="Seleccione Categoria"
          @input="setCategoriaId"
          itemText="nombre"
          itemValue="idCategoria"
          :items="allCategorias"
          ref="combo"
        />
        <v-text-field outlined v-model="editedItem.nombre" type="text" label="Nombre"></v-text-field>
        <v-text-field outlined v-model="editedItem.precio" type="number" label="Precio"></v-text-field>
        <v-card-actions> </v-card-actions>
      </template>
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="onCloseDialog"> Cancelar </v-btn>
        <v-btn color="blue darken-1" text @click="save"> Guardar </v-btn>
      </template>
    </add-dialog>
  </div>
</template>
  <script>
import basicCrud from '@/components/BasicCrud.vue'
import addDialog from '@/components/AddDialogs/AddDialog.vue'
import combo from '@/components/combos/Combo.vue'
import { mapGetters, mapActions } from 'vuex'
import ConfirmationDialog from '../dialogs/ConfirmationDialog.vue'
import mixin from '@/mixins/productos.mixin'
export default {
  components: {
    basicCrud,
    addDialog,
    combo,
    ConfirmationDialog,
  },
  mixins: [mixin],
  data: () => ({
    entidad: 'producto',
    headers: [
      { text: 'Categoria', value: 'categoria' },
      { text: 'Nombre', value: 'nombre' },
      { text: 'Precio', value: 'precio' },
      { text: 'Actions', value: 'actions', align: 'end' },
    ],
    items: [],
    categorias: [],
  }),
  computed: {
    ...mapGetters(['allCategorias', 'allProductos']),
  },
  methods: {
    ...mapActions(['addProducto', 'updateProducto', 'deleteProducto']),
    setCategoriaId(categoriaId) {
      this.editedItem.categoriaId = categoriaId
    },
    onAdd() {
      this.$refs.addDialog.dialog = true
    },
    onEdit(item) {
      console.log('editandooo', item)
      console.log(this.items)
      this.editedIndex = this.items.indexOf(item)
      this.$refs.addDialog.dialog = true
      this.$refs.addDialog.editedIndex = this.editedIndex
      this.setRefs(item)
    },
    setRefs(item) {
      console.log('REfs', item)
      this.editedItem.nombre = item.nombre
      this.editedItem.categoria = item.categoria
      this.editedItem.categoriaId = item.categoriaId
      this.editedItem.combo = item.combo
      this.editedItem.precio = item.precio
      this.editedItem.productoId = item.productoId
      this.editedItem.stock = item.stock
      setTimeout(() => {
        this.$refs.combo.model = item.categoriaId
      }, 100)
    },

    onCloseDialog() {
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.$refs.combo.model = -1
        this.$refs.addDialog.dialog = false
      })
    },
    getCategorias() {
      this.categorias = this.allCategorias
    },
    setProductoTableItems() {
      this.items = []
      let resultado = this.allProductos
      resultado.forEach((producto) => {
        this.allCategorias.forEach((categoria) => {
          if (producto.categoriaId == categoria.idCategoria) {
            producto['categoria'] = categoria.nombre
          }
        })
      })
      resultado.forEach((element) => {
        if (!element.combo) {
          this.items.push(element)
        }
      })
    },
    async save() {
      let response = await this.mixinSave(this.editedItem, this.editedIndex)
      if (response.status == '200') {
        console.log('actualizado con exito')
      } else if (response.status == '201') {
        console.log('guardado con exito', response)
      }
      this.refresh()
      this.onCloseDialog()
    },
    refresh() {
      this.setProductoTableItems()
    },
    async deleteItem(producto) {
      let response = await this.onDelete(producto)
      if (response != null) {
        console.log('eliminado con exito')
      }
      // this.refreshData()
      this.setProductoTableItems()
    },
  },
  created() {
    this.getCategorias()
    this.setProductoTableItems()
  },
}
</script>