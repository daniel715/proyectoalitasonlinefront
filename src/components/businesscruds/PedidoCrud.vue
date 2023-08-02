<template>
  <div>
    <basic-crud
      ref="basicCrud"
      @onAdd="onAdd"
      @onEdit="onEdit"
      @refresh="refresh"
      @onDelete="onDelete"
      :headers="headers"
      :entidad="entidad"
      :items="items"
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
    editedItem: {
      pedidoId: '',
      fechaPedido: '',
      fechaSalida: '',
      fechaEntrega: '',
      direccion: '',
      metodoPago: '',
      observacion: '',
      montoRecibido: 0,
      totalPagar: '',
      respuestaPagoApp: null,
      status: null,
      direccionIp: null,
      resumen: [],
    },
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
    onEdit(item) {
      console.log(item)
      this.editedIndex = this.items.indexOf(item)
      this.$refs.addPedidoDialog.dialog = true
      this.$refs.addPedidoDialog.editedIndex = this.editedIndex
      // this.$refs.addPedidoDialog.setResumen(item.resumen)
      // this.$refs.addPedidoDialog.setTotalPedido(item.totalPagar)
      this.setRefs(item)
    },
    setRefs(item) {
      console.log("Refs", item)
      setTimeout(() => {
        this.$refs.addPedidoDialog.editedItem.pedidoId = item.pedidoId
        this.$refs.addPedidoDialog.editedItem.fechaSalida = item.fechaSalida
        this.$refs.addPedidoDialog.editedItem.fechaEntrega = item.fechaEntrega
        this.$refs.addPedidoDialog.editedItem.direccion = item.direccion
        this.$refs.addPedidoDialog.editedItem.metodoPago = item.metodoPago
        this.$refs.addPedidoDialog.editedItem.observacion = item.observacion
        this.$refs.addPedidoDialog.editedItem.montoRecibido = item.montoRecibido
        this.$refs.addPedidoDialog.editedItem.totalPagar = item.totalPagar
        this.$refs.addPedidoDialog.editedItem.respuestaPagoApp = item.respuestaPagoApp
        this.$refs.addPedidoDialog.editedItem.status = item.status
        this.$refs.addPedidoDialog.editedItem.direccionIp = item.direccionIp
        this.$refs.addPedidoDialog.editedItem.resumen = item.resumen

        this.$refs.addPedidoDialog.$refs.fechaPedidoRef.date = item.fechaPedido
        this.$refs.addPedidoDialog.$refs.fechaSalidaRef.date = item.fechaSalida
        this.$refs.addPedidoDialog.$refs.fechaEntregaRef.date = item.fechaEntrega

        this.$refs.addPedidoDialog.$refs.productoComboRef.pedidosArray = item.resumen
        this.$refs.addPedidoDialog.$refs.productoComboRef.totalPorPedido = item.totalPagar
      }, 500)
    },
    refresh() {
      console.log('refrescando')
      this.setPedidoTableItems()
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
      let pedidos = this.allPedidos
      pedidos.forEach((pedido) => {
        console.log(pedido)
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
        console.log(productosDePedidoConInfo)
        for (let i = 0; i < productosDePedidoConInfo.length; i++) {
          object = {
            pedidoId: pedido.pedidoId,
            productoId : productosDePedidoConInfo[i].productoId,
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
    },
  },
  created() {
    this.setPedidoTableItems()
  },
})
</script>