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
      :totalVentas="totalVentas"
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
      { text: 'Fecha Pedido', value: 'fechaPedido', width: '105px' },
      { text: 'Fecha Salida ', value: 'fechaSalida', width: '105px' },
      { text: 'Fecha Entrega', value: 'fechaEntrega', width: '105px' },
      { text: 'Direccion', value: 'direccion' },
      { text: 'Metodo Pago', value: 'metodoPago' },
      { text: 'Observaciones', value: 'observacion' },
      { text: 'Resumen', value: 'resumen', width: '800px' },
      { text: 'Total', value: 'totalPagar', width: '20px' },
      { text: 'Monto Recibido', value: 'montoRecibido' },
      { text: 'Vuelto', value: 'vuelto', width: '20px' },
      { text: 'Acciones', width: '100px', value: 'actions', align: 'end' },
    ],
    items: [],
    entidad: 'Pedido',
    productosIdArray: [],
    editedIndex: -1,
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
    totalVentas: 0,
  }),
  computed: {
    ...mapGetters(['allPedidos', 'allCategorias', 'allProductos', 'allPedidosProductos', 'alltotalPorPedido']),
  },
  methods: {
    ...mapActions(['deletePedido', 'deletePedidoProducto']),
    onAdd() {
      this.editedIndex = -1
      this.$refs.addPedidoDialog.dialog = true
      this.$refs.addPedidoDialog.editedIndex = this.editedIndex
      this.$refs.addPedidoDialog.setFechasToCreate()
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
      console.log('Refs', item)
      setTimeout(() => {
        this.$refs.addPedidoDialog.editedItem.pedidoId = item.pedidoId
        this.$refs.addPedidoDialog.editedItem.fechaPedido = item.fechaPedido
        this.$refs.addPedidoDialog.editedItem.fechaSalida = item.fechaSalida
        this.$refs.addPedidoDialog.editedItem.fechaEntrega = item.fechaEntrega
        this.$refs.addPedidoDialog.editedItem.direccion = item.direccion
        this.$refs.addPedidoDialog.editedItem.metodoPago = item.metodoPago
        this.$refs.addPedidoDialog.editedItem.observacion = item.observacion
        this.$refs.addPedidoDialog.editedItem.montoRecibido = item.montoRecibido
        this.$refs.addPedidoDialog.editedItem.respuestaPagoApp = item.respuestaPagoApp
        this.$refs.addPedidoDialog.editedItem.status = item.status
        this.$refs.addPedidoDialog.editedItem.direccionIp = item.direccionIp
        this.$refs.addPedidoDialog.editedItem.resumen = item.resumen

        this.$refs.addPedidoDialog.$refs.fechaPedidoRef.date = item.fechaPedido
        this.$refs.addPedidoDialog.$refs.fechaSalidaRef.date = item.fechaSalida
        this.$refs.addPedidoDialog.$refs.fechaEntregaRef.date = item.fechaEntrega

        this.$refs.addPedidoDialog.$refs.productoComboRef.pedidosArray = item.resumen
        this.$refs.addPedidoDialog.$refs.productoComboRef.totalPorPedido = item.totalPagar
      }, 100)
    },
    refresh() {
      console.log('refrescando en pedido')
      setTimeout(() => {
        this.setPedidoTableItems()
      }, 100)
    },
    async onDelete(item) {
      let response = await this.deletePedidoProducto(item.pedidoId)
      if (response.status == '204') {
        console.log('eliminado con exito, falta eliminar tabla inntermedia ...')
        let response2 = await this.deletePedido(item)
        console.log('respuesta2', response2)
        this.refresh()
      }
    },
    setPedidoTableItems() {
      this.totalVentas = 0
      let pedidos = []
      this.items = []

      this.allPedidos.forEach((element) => {
        pedidos.push(element)
      })

      pedidos.forEach((pedido) => {
        let itemResumen = []
        let productosDePedidoConInfo = []
        let productosDePedido = []
        let categorias = []
        let object = {}

        // this.allPedidosProductos.forEach((element) => {
        //   if (element.pedidoId == pedido.pedidoId) {
        //     productosDePedido.push(element)
        //   }
        // })

        for (let index = 0; index < this.allPedidosProductos.length; index++) {
          if (this.allPedidosProductos[index].pedidoId == pedido.pedidoId) {
            productosDePedido.push(this.allPedidosProductos[index])
          }
        }
        console.log('productosDePedido', productosDePedido)
        // this.allProductos.forEach((producto) => {
        //   productosDePedido.forEach((element) => {
        //     if (producto.productoId == element.productoId) {
        //       productosDePedidoConInfo.push(producto)
        //     }
        //   })
        // })
        for (let index1 = 0; index1 < this.allProductos.length; index1++) {
          for (let index2 = 0; index2 < productosDePedido.length; index2++) {
            if (this.allProductos[index1].productoId == productosDePedido[index2].productoId) {
              let object = this.allProductos[index1]
              object.cantidad = productosDePedido[index2].cantidad
              productosDePedidoConInfo.push(object)
            }
          }
        }

        // this.allCategorias.forEach((categoria) => {
        //   productosDePedidoConInfo.forEach((element) => {
        //     if (element.categoriaId == categoria.idCategoria) {
        //       categorias.push(categoria)
        //     }
        //   })
        // })

        for (let index1 = 0; index1 < this.allCategorias.length; index1++) {
          for (let index2 = 0; index2 < productosDePedidoConInfo.length; index2++) {
            if (productosDePedidoConInfo[index2].categoriaId == this.allCategorias[index1].idCategoria) {
              categorias.push(this.allCategorias[index1])
            }
          }
        }

        for (let i = 0; i < productosDePedidoConInfo.length; i++) {
          object = {
            pedidoId: pedido.pedidoId,
            productoId: productosDePedidoConInfo[i].productoId,
            categoria: categorias[i].nombre,
            producto: productosDePedidoConInfo[i].nombre,
            cantidad: productosDePedidoConInfo[i].cantidad,
            precio: productosDePedidoConInfo[i].precio,
            total: productosDePedidoConInfo[i].precio * productosDePedidoConInfo[i].cantidad,
          }
          itemResumen.push(object)
        }
        pedido['resumen'] = itemResumen
        pedido['vuelto'] = pedido.montoRecibido - pedido.totalPagar
      })
      for (let index = 0; index < pedidos.length; index++) {
        this.totalVentas = this.totalVentas + pedidos[index].totalPagar
        this.items.push(pedidos[index])
      }
    },
  },
  created() {
    this.setPedidoTableItems()
  },
})
</script>