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
    <add-dialog @closeDialog="onCloseDialog" ref="addDialog" entidad="Combo">
      <template v-slot:body>
        <v-row>
          <v-col>
            <combo
              label="Seleccione Categoria"
              @input="setCategoriaId"
              itemText="nombre"
              itemValue="idCategoria"
              :items="categorias"
              ref="combo"
            />
            <v-select
              label="Productos"
              v-model="select"
              :items="productos"
              item-text="nombre"
              item-value="productoId"
              ref="input"
              multiple
              outlined
              class="pa-0"
            ></v-select>
            <v-spacer></v-spacer>
            <span>Precio Total {{ precioAcumulado }}</span>
            <v-text-field class="mt-5" outlined v-model="editedItem.precio" type="number" label="Precio"></v-text-field>
            <v-spacer></v-spacer>
            <v-text-field disabled outlined v-model="ganancia" type="number" label="Diferencia"></v-text-field>
          </v-col>
        </v-row>
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
import { mapGetters, mapActions } from 'vuex'
import combo from '@/components/combos/Combo.vue'
import mixin from '@/mixins/productos.mixin'
export default {
  components: {
    basicCrud,
    addDialog,
    combo,
  },
  mixins: [mixin],
  data: () => ({
    select: '',
    entidad: 'producto',
    headers: [
      { text: 'Categoria', value: 'categoria' },
      { text: 'Nombre', value: 'nombre' },
      { text: 'Precio', value: 'precio' },
      { text: 'Actions', value: 'actions', align: 'end' },
    ],
    items: [],
    editedItem: {
      categoriaId: '',
      combo: true,
      nombre: '',
      precio: 0,
      productoId: '',
      stock: null,
    },
    defaultItem: {
      categoriaId: '',
      combo: true,
      nombre: '',
      precio: 0,
      productoId: '',
      stock: null,
    },
    editedIndex: -1,
    productos: [],
    productosSeleccionados: [],
    ganancia: 0,
    precioAcumulado: 0,
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
    setComboTableItems() {
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
        if (element.combo) {
          element.nombre = element.nombre.slice(0, -2)
          this.items.push(element)
        }
      })
    },
    onAdd() {
      this.$refs.addDialog.editedIndex = -1
      this.$refs.addDialog.dialog = true
    },
    async save() {
      // this.editedItem.
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
      this.setComboTableItems()
    },
    onEdit(item) {
      this.editedIndex = this.items.indexOf(item)
      this.$refs.addDialog.dialog = true
      this.$refs.addDialog.editedIndex = this.editedIndex
      this.setRefs(item)
    },
    async deleteItem(producto) {
      let response = await this.onDelete(producto)
      if (response != null) {
        console.log('eliminado con exito')
      }
      this.setComboTableItems()
    },
    setRefs(item) {
      console.log('REfs', item)
      this.editedItem.nombre = item.nombre
      this.editedItem.categoria = item.categoria
      this.editedItem.categoriaId = item.categoriaId
      this.editedItem.combo = true
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
        this.select = []
      })
    },
    setProductos() {
      this.productos = this.allProductos.map((element) => {
        if (!element.combo) return element
      })
    },
    setPrecioTotal() {
      this.editedItem.precio = 0
      this.editedItem.nombre = ''
      this.productosSeleccionados.forEach((element) => {
        this.editedItem.precio = this.editedItem.precio + element.precio
        this.editedItem.nombre = this.editedItem.nombre + element.nombre + ' + '
      })
      this.precioAcumulado = this.editedItem.precio
    },
    setGanancia() {
      this.ganancia = 0
      console.log('setenado ganancia')
      this.ganancia = this.precioAcumulado - this.editedItem.precio
    },
    setCategorias() {
      this.categorias = this.allCategorias
    },
  },
  watch: {
    select(itemsId, oldVal) {
      this.productosSeleccionados = []
      console.log(itemsId)
      this.allProductos.forEach((producto) => {
        itemsId.forEach((itemId) => {
          if (itemId == producto.productoId) {
            let objeto = {
              productoId: producto.productoId,
              categoriaId: producto.categoriaId,
              categoria: producto.categoria,
              combo: producto.combo,
              nombre: producto.nombre,
              precio: producto.precio,
              stock: producto.stock,
            }
            this.productosSeleccionados.push(objeto)
          }
        })
      })
      this.setPrecioTotal()
    },
    editedItem: {
      handler(val) {
        console.log(val)
        this.setGanancia()
      },
      deep: true,
    },
  },
  created() {
    this.setComboTableItems()
    this.setProductos()
    this.setCategorias()
  },
}
</script>