import { mapGetters, mapActions } from 'vuex'
import { UUID } from 'uuidjs'
export default {
  data: () => ({
    editedItem: {
      categoriaId: '',
      productoId: '',
      nombre: '',
      precio: '',
      isCombo: false,
      stock: null,
    },
    defaultItem: {
      categoriaId: '',
      productoId: '',
      nombre: '',
      precio: '',
      isCombo: false,
      stock: null,
    },
    editedIndex: -1,
  }),
  methods: {
    ...mapActions(['addProducto', 'updateProducto', 'deleteProducto']),
    async mixinSave(item, editedIndex) {
      console.log(editedIndex)
      //editando producto
      if (editedIndex > -1) {
        let respuesta = await this.updateProducto(item)
        if (respuesta.status == '200') {
          return respuesta
        }
      } else {
        console.log(item)
        //creando nuevo prouducto
        item.productoId = UUID.generate()
        let response = await this.addProducto(item)
        if (response.status == '201') {
          return response
        }
      }
    },

    async onDelete(producto) {
      let response = await this.deleteProducto(producto)
      if (response.status == '204') {
        return response
      }
    },
  }
};
