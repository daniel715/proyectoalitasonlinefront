<template>
  <v-dialog @click:outside="close" v-model="dialog" max-width="800px">
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ formTitle }}</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="10">
              <div class="mr-2" style="width: 50%">
                <DateTimeInput ref="fechaPedidoRef" @input="setFechaPedido" label="Fecha pedido" />
              </div>
              <div style="width: 50%">
                <DateTimeInput ref="fechaSalidaRef" @input="setFechaSalida" label="Fecha Salida" />
              </div>
              <div style="width: 50%">
                <DateTimeInput ref="fechaEntregaRef" @input="setFechaEntrega" label="Fecha entrega" />
              </div>
              <producto-combo
                @pedidosEmpty="onEmptyPedidos"
                class="my-1"
                @itemsSelected="setResumen"
                @input="setTotalPedido"
                ref="productoComboRef"
              />
              <div class="my-1">
                <h3>Metodo de pago</h3>
                <v-radio-group row v-model="editedItem.metodoPago">
                  <v-radio v-for="n in radioItems" :key="n" :label="`${n}`" :value="n"></v-radio>
                </v-radio-group>
              </div>
              <v-text-field outlined v-model="editedItem.direccion" label="Direccion"></v-text-field>

              <v-text-field
                type="number"
                outlined
                v-model.number="editedItem.montoRecibido"
                label="Monto Recibido"
                class="mt-5"
              ></v-text-field>

              <v-text-field outlined v-model="editedItem.observacion" label="Observaciones"></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close"> Cancelar </v-btn>
        <v-btn color="blue darken-1" text @click="save"> Guardar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
import DateTimeInput from '../inputs/DateTimeInput.vue'
import { UUID } from 'uuidjs'
import ProductoCombo from '../combos/ProductoCombo.vue'
import { mapActions } from 'vuex'
import swal from 'sweetalert'
export default defineComponent({
  components: {
    DateTimeInput,
    ProductoCombo,
  },
  data: () => ({
    radioGroup: '',
    dialog: false,
    editedIndex: -1,
    radioItems: ['plin', 'yape', 'efectivo'],
    fechaSalida: '',
    fechaPedido: '',
    fechaEntrega: '',
    editedItem: {
      pedidoId: '',
      fechaPedido: '',
      fechaSalida: '',
      fechaEntrega: '',
      direccion: '',
      metodoPago: 'plin',
      observacion: '',
      montoRecibido: 0,
      respuestaPagoApp: null,
      status: null,
      direccionIp: null,
      resumen: [],
    },
    defaultItem: {
      pedidoId: '',
      fechaPedido: '',
      fechaSalida: '',
      fechaEntrega: '',
      direccion: '',
      metodoPago: 'plin',
      observacion: '',
      montoRecibido: 0,
      respuestaPagoApp: null,
      status: null,
      direccionIp: null,
      resumen: [],
    },
    entidad: 'pedido',
    currentDate: '',
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Agregar Pedido' : 'Editar Pedido'
    },
  },
  methods: {
    ...mapActions(['addPedido', 'addPedidoProducto', 'updatePedido', 'deletePedidoProducto']),
    setFechaPedido(data) {
      if (data != null) {
        this.editedItem.fechaPedido = data
      }
    },
    setFechaSalida(data) {
      if (data != null) {
        this.fechaSalida = data
        this.editedItem.fechaSalida = data
      }
    },
    setFechaEntrega(data) {
      if (data != null) {
        this.fechaEntrega = data
        this.editedItem.fechaEntrega = data
      }
    },
    setFechasToCreate() {
      console.log('seteando fechas')
      this.setCurrentDate()
      this.editedItem.fechaEntrega = this.currentDate
      this.editedItem.fechaPedido = this.currentDate
      this.editedItem.fechaSalida = this.currentDate

      setTimeout(() => {
        this.$refs.fechaPedidoRef.date = this.currentDate
        this.$refs.fechaSalidaRef.date = this.currentDate
        this.$refs.fechaEntregaRef.date = this.currentDate
      }, 100)
    },
    setCurrentDate() {
      let MyDate = new Date()
      let year = MyDate.getFullYear()
      let month = String(MyDate.getMonth() + 1).padStart(2, '0')
      let day = MyDate.getDate()
      let date = year + '-' + month + '-' + day

      let time = MyDate.toTimeString().split(' ')[0]
      this.currentDate = date + ' ' + time

      this.currentDate = this.currentDate.slice(0, -3)
      console.log(this.currentDate)
    },
    async save() {
      console.log(this.editedIndex)
      if (this.editedIndex > -1) {
        let respuesta = await this.updatePedido(this.editedItem)
        console.log(respuesta)
        if (respuesta.status == '200') {
          // ACTUALIZANDO TABLA PEDIDO_PRODUCTO borramos los items del pedido primero
          let deleteResponse = await this.deletePedidoProducto(this.editedItem.pedidoId)
          // procedemos a setear el nuevo resumen
          console.log(deleteResponse)
          if (deleteResponse.status == '204') {
            for (let index = 0; index < this.editedItem.resumen.length; index++) {
              this.addPedidoProducto(this.editedItem.resumen[index])
            }
            swal({
              title: 'Pedido editado Exitosamente!',
              text: '',
              icon: 'success',
              button: 'Cerrar',
            }).then((e) => {
              this.close()
              this.refresh()
            })
          }
        }
      } else {
        //creando nuevo pedido
        let response = await this.addPedido(this.editedItem)
        if (response.status == '201') {
          // ACTUALIZANDO TABLA PEDIDO_PRODUCTO
          for (let index = 0; index < this.editedItem.resumen.length; index++) {
            this.addPedidoProducto(this.editedItem.resumen[index])
          }
        }
        swal({
          title: 'Pedido creado Exitosamente!',
          text: '',
          icon: 'success',
          button: 'Cerrar',
        }).then((e) => {
          this.refresh()
          this.close()
        })
      }
    },
    async refresh() {
      this.$emit('refresh')
    },
    close() {
      this.editedItem.pedidoId = ''
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.deleteComboRefs()
        this.editedIndex = -1
      })
    },
    deleteComboRefs() {
      this.$refs.productoComboRef.pedidosArray = []
    },
    setTotalPedido(data) {
      // this.editedItem.totalPagar = data
    },
    setResumen(data) {
      console.log('resumen', data)
      if (data.length > 0) {
        this.editedItem.resumen = []
        if (this.editedIndex > -1) {
          for (let index = 0; index < data.length; index++) {
            let objeto = {
              pedidoId: this.editedItem.pedidoId,
              productoId: data[index].productoId,
              cantidad: parseInt(data[index].cantidad),
            }
            this.editedItem.resumen.push(objeto)
          }
        } else {
          for (let index = 0; index < data.length; index++) {
            let objeto = {
              pedidoId: this.editedItem.pedidoId,
              productoId: data[index].productoId,
              cantidad: parseInt(data[index].cantidad),
            }
            this.editedItem.resumen.push(objeto)
          }
        }
      } else {
        this.editedItem.resumen = []
      }
    },
    onEmptyPedidos() {
      this.editedItem.resumen = []
    },
  },
  watch: {
    dialog(newVal, oldVal) {
      if (newVal) {
        const dateString = Date.now().toString(36)
        const randomness = Math.random().toString(36).substr(2)
        const uniqueId = dateString + randomness
        console.log(uniqueId)
        this.editedItem.pedidoId = uniqueId
      }
    },
  },
  created() {
    this.setCurrentDate()
  },
})
</script>