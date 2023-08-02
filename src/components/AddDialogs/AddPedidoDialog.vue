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
              <producto-combo @pedidosEmpty="onEmptyPedidos" class="my-1" @itemsSelected="setResumen" @input="setTotalPedido" ref="productoComboRef" />
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
      metodoPago: '',
      observacion: '',
      montoRecibido: 0,
      totalPagar: '',
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
      metodoPago: '',
      observacion: '',
      montoRecibido: 0,
      totalPagar: '',
      respuestaPagoApp: null,
      status: null,
      direccionIp: null,
      resumen: [],
    },
    entidad: 'pedido',
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Agregar Pedido' : 'Editar Pedido'
    },
  },
  methods: {
    ...mapActions(['addPedido', 'addPedidoProducto', 'updatePedido']),
    setFechaPedido(data) {
      if (data != null) {
        this.fechaPedido = data
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
    async save() {
      console.log(this.editedIndex)
      //editando categoria
      if (this.editedIndex > -1) {
        let respuesta = await this.updatePedido(this.editedItem)
        console.log(respuesta)
        if (respuesta.status == '201') {
          // ACTUALIZANDO TABLA PEDIDO_PRODUCTO
          for (let index = 0; index < this.editedItem.resumen.length; index++) {
            this.addPedidoProducto(this.editedItem.resumen[index])
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
      }
      this.refresh()
      this.close()
    },
    refresh() {
      this.$emit('refresh')
    },
    close() {
      this.editedItem.pedidoId = ''
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    setTotalPedido(data) {
      this.editedItem.totalPagar = data
    },
    setResumen(data) {
      console.log('resumen',data)
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
      }
    },
    onEmptyPedidos(){
      this.editedItem.resumen = []
      this.editedItem.totalPagar = 0
    }
  },
  watch: {
    dialog(newVal, oldVal) {
      if (newVal) {
        ;(this.editedItem.fechaEntrega = this.fechaEntrega),
          (this.editedItem.fechaPedido = this.fechaPedido),
          (this.editedItem.fechaSalida = this.fechaSalida),
          (this.editedItem.pedidoId = UUID.generate())
      }
    },
    editedItem: {
      handler(newVal, oldval) {
        setTimeout(() => {
          if (newVal.resumen.length == 0) {
            this.$refs.productoComboRef.pedidosArray = []
            this.$refs.productoComboRef.totalPorPedido = 0
            this.$refs.productoComboRef.productoSeleccionado = { nombre: '', precio: '' }
            this.$refs.productoComboRef.cantidad = ''
          }
        }, 500)
      },
      deep: true,
    },
  },
})
</script>