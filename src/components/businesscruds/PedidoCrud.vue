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
    <add-pedido-dialog ref="addPedidoDialog" />
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
    AddPedidoDialog,
  },
  data: () => ({
    headers: [
      { text: 'Fecha Pedido', value: 'fechaPedido' },
      { text: 'Fecha Salida ', value: 'fechaSalida' },
      { text: 'Fecha Entrega', value: 'fechaEntrega' },
      { text: 'Direccion', value: 'direccion' },
      { text: 'Metodo Pago', value: 'metodoPago' },
      { text: 'Observaciones', value: 'observacion' },
      { text: 'Resumen', value: 'resumen' },
      { text: 'Total', value: 'precioTotal' },
      { text: 'Actions', value: 'actions', align: 'end' },
    ],
    items: [],
    entidad: 'Pedido',
    productosIdArray: [],
  }),
  computed: {
    ...mapGetters(['allPedidos', 'allCategorias', 'allProductos', 'allPedidosProductos', 'alltotalPorPedido']),
  },
  methods: {
    onEdit() {},
    onAdd() {
      this.$refs.addPedidoDialog.dialog = true
    },
    onDelete() {},
    setPedidoTableItems() {
      this.allPedidos.forEach((pedido) => {
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
        this.allProductos.forEach((producto) => {
          productosDePedido.forEach((element) => {
            if (producto.productoId == element.productoId) {
              productosDePedidoConInfo.push(producto)
            }
          })
        })
        this.allCategorias.forEach((categoria) => {
          productosDePedidoConInfo.forEach((element) => {
            if (element.categoriaId == categoria.idCategoria) {
              categorias.push(categoria)
            }
          })
        })
        for (let i = 0; i < productosDePedidoConInfo.length; i++) {
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

        // for (let i = 0; i < array.length; i++) {
        //   const element = array[i];
          
        // }

      })
      this.items = this.allPedidos
    },
  },
  created() {
    this.setPedidoTableItems()
  },
})
</script>