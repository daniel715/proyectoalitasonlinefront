<template>
  <div>
    <basic-crud
      ref="basicCrud"
      @onAdd="onAdd"
      @refresh="refresh"
      @onDelete="onDelete"
      :headers="headers"
      :entidad="entidad"
      :items="items"
      showVisor
      showDelete
      showEdit
    />
    <add-pedido-dialog @refresh="refresh" ref="addPedidoDialog" />
  </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
import basicCrud from '@/components/BasicCrud.vue'
import { mapActions, mapGetters } from 'vuex'
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
      { text: 'Total', value: 'totalPagar' },
      { text: 'Actions', width: '150px', value: 'actions', align: 'end' },
    ],
    items: [],
    entidad: 'Pedido',
    productosIdArray: [],
  }),
  computed: {
    pedidos: {
      get: function () {
        return this.items
      },
      set: function (value) {
        this.$emit('listchange', value)
      },
    },
    ...mapGetters(['allPedidos', 'allCategorias', 'allProductos', 'allPedidosProductos', 'alltotalPorPedido']),
  },
  methods: {
    ...mapActions(['deletePedido', 'deletePedidoProducto']),
    onAdd() {
      this.$refs.addPedidoDialog.dialog = true
    },
    refresh() {
      setTimeout(() => {
        console.log('refrescando')
        this.setPedidoTableItems()
      }, 500)
    },
    async onDelete(item) {
      let response = await this.deletePedidoProducto(item.pedidoId)
      if (response.status == '204') {
        console.log('eliminado con exito, falta eliminar tabla inntermedia ...')
        let response2 = await this.deletePedido(item)
        console.log('respuesta2', response2)
        this.setPedidoTableItems()
      }
    },
    setPedidoTableItems() {
      console.log(this.allPedidosProductos.length)
      let pedidos = this.allPedidos
      pedidos.forEach((pedido) => {
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
      })
      this.items = pedidos
    }
  },
  created() {
    this.setPedidoTableItems()
  },
})
</script>