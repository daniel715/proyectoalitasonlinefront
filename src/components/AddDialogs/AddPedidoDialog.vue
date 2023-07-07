<template>
  <v-dialog @click:outside="close" v-model="dialog" max-width="1000px">
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ formTitle }}</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="8">
              <div style="width: 50%">
                <DateTimeInput @input="setFechaPedido" label="Fecha pedido" />
              </div>
              <div style="width: 50%">
                <DateTimeInput @input="setFechaSalida" label="Fecha Salida" />
              </div>
              <div style="width: 50%">
                <DateTimeInput @input="setFechaEntrega" label="Fecha entrega" />
              </div>
              <v-text-field
                @keydown.enter="save"
                autofocus
                outlined
                v-model="editedItem.direccion"
                label="Direccion"
              ></v-text-field>
              <v-container class="px-0" fluid>
                <h3>Metodo de pago</h3>
                <v-radio-group row v-model="editedItem.metodoPago">
                  <v-radio v-for="n in radioItems" :key="n" :label="`${n}`" :value="n"></v-radio>
                </v-radio-group>
              </v-container>
              <v-text-field
                @keydown.enter="save"
                autofocus
                outlined
                v-model="editedItem.observacion"
                label="Observaciones"
              ></v-text-field>
              <producto-combo />
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
export default defineComponent({
  components: {
    DateTimeInput,
    ProductoCombo,
  },
  data: () => ({
    radioGroup: '',
    dialog: false,
    editedIndex: -1,
    radioItems: ['Plin', 'Yape', 'Efectivo'],
    editedItem: {
      id: '',
      fechaPedido: '',
      fechaSalida: '',
      fechaEntrega: '',
      direccion: '',
      metodoPago: '',
      observacion: '',
      resumen: '',
    },
    defaultItem: {
      id: '',
      fechaPedido: '',
      fechaSalida: '',
      fechaEntrega: '',
      direccion: '',
      metodoPago: '',
      observacion: '',
      resumen: '',
    },
    entidad: 'categoria',
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Agregar Pedido' : 'Editar Pedido'
    },
  },
  methods: {
    setFechaPedido(data) {
      if (data != null) {
        console.log(data)
        this.editedItem.fechaPedido = data
      }
    },
    setFechaSalida(data) {
      if (data != null) {
        console.log(data)
        this.editedItem.fechaSalida = data
      }
    },
    setFechaEntrega(data) {
      if (data != null) {
        console.log(data)
        this.editedItem.fechaEntrega = data
      }
    },
    async save() {
      console.log(this.editedIndex)
      //editando categoria
      if (this.editedIndex > -1) {
        this.editedItem.nombre = this.nombre
        let respuesta = await this.$axios.patch(this.entidad + '/update/' + this.editedItem.id, this.editedItem)
        console.log(respuesta)
        if (respuesta.status == '201') {
        }
      } else {
        //creando nueva categoria
        this.editedItem.id = UUID.generate()
        this.editedItem.nombre = this.nombre
        let response = await this.$axios.post(this.entidad + '/save', this.editedItem)
        if (response.status == '201') {
        }
      }
      this.refresh()
      this.close()
    },
    refresh() {
      this.$emit('refresh')
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.nombre = ''
      })
    },
  },
})
</script>