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
      showVisor
    />
    <add-pedido-dialog ref="addPedidoDialog"/>
  </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
import basicCrud from '@/components/BasicCrud.vue'
import { mapGetters } from 'vuex'
import AddPedidoDialog from '../AddDialogs/AddPedidoDialog.vue'
export default defineComponent({
  components: {
    basicCrud,
    AddPedidoDialog
  },
  data: () => ({
    headers: [
      { text: 'Fecha Pedido', value: 'fechaPedido' },
      { text: 'Fecha Salida ', value: 'fechaSalida' },
      { text: 'Fecha Entrega', value: 'fechaEntrega' },
      { text: 'Direccion', value: 'direccion' },
      { text: 'Metodo Pago', value: 'metodoPago' },
      { text: 'Observaciones', value: 'observacion' },
      { text: 'Resumen', value: 'resumen'},
      { text: 'Actions', value: 'actions', align: 'end' },
    ],
    items: [],
    entidad: 'Pedido',
    productosIdArray: [],
  }),
  computed: {
    ...mapGetters(['allPedidos', 'allCategorias', 'allProductos', 'allPedidosProductos']),
  },
  methods: {
    onEdit() {},
    onAdd() {
      this.$refs.addPedidoDialog.dialog = true
    },
    onDelete() {},
    setPedidoTableItems() {
      this.allPedidos.forEach((pedido) => {
        // console.log(pedido)
        let itemResumen = []
        let productosDePedidoConInfo = []
        let productosDePedido = []
        let categorias = []
        let object = {}

        this.allPedidosProductos.forEach((element) => {
          if (element.pedidoId == pedido.pedidoId) {
            productosDePedido.push(element)
          }
        })
        console.log(productosDePedido)
        // productosDePedido = JSON.stringify(productosDePedido)


        this.allProductos.forEach((producto) => {
          productosDePedido.forEach((element) => {
            if (producto.productoId == element.productoId) {
              productosDePedidoConInfo.push(producto)
            }
          })
        })
        // console.log(productosDePedidoConInfo)
        // productosDePedidoConInfo = JSON.stringify(productosDePedidoConInfo)

        this.allCategorias.forEach((categoria) => {
          productosDePedidoConInfo.forEach((element) => {
            if (element.categoriaId == categoria.idCategoria) {
              categorias.push(categoria)
            }
          })
        })
        // console.log(categorias)
        // categorias = JSON.stringify(categorias)

        for (let i = 0; i < productosDePedidoConInfo.length; i++) {
          console.log('categoria: ' + categorias[i])
          object = {
            categoria: categorias[i].nombre,
            producto: productosDePedidoConInfo[i].nombre,
            cantidad: productosDePedido[i].cantidad,
            precio: productosDePedidoConInfo[i].precio,
            total: productosDePedidoConInfo[i].precio * productosDePedido[i].cantidad,
          }
          itemResumen.push(object)
        }
        pedido['resumen'] = itemResumen
      })

      this.items = this.allPedidos
      // console.log(this.items)
    },
  },
  created() {
    this.setPedidoTableItems()
  },
})
</script>