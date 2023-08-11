<template>
  <v-row>
    <v-col cols="12">
      <table>
        <thead>
          <th align="left" style="width: 60%">Producto</th>
          <th align="left" style="width: 20%">Precio</th>
          <th align="left" style="width: 20%">Cantidad</th>
          <th align="left" style="width: 20%">Total</th>
          <th align="left" style="width: 20%"></th>
        </thead>
        <tbody>
          <tr>
            <td>
              <v-combobox
                v-model="productoSeleccionado"
                :items="productos"
                variant="solo-inverted"
                item-text="nombre"
                item-value="productoId"
                outlined
                class="mr-5"
              ></v-combobox>
            </td>
            <td style="text-align: left; vertical-align: center">{{ productoSeleccionado.precio }}</td>
            <td>
              <v-text-field
                @keydown.enter="addItem"
                outlined
                class="mr-5"
                type="number"
                v-model="cantidad"
                label=""
              ></v-text-field>
            </td>
            <td>{{ productoSeleccionado.precio * cantidad }}</td>
            <td class="ml-5 pl-5">
              <v-btn @click="addItem" small icon color="blue">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </table>
      <table style="width: 100%">
        <thead>
          <th class="text-left">Producto</th>
          <th class="text-left">Cantidad</th>
          <th class="text-left">Precio</th>
          <th class="text-left">Total</th>
          <th class="text-left"></th>
        </thead>
        <tbody>
          <tr v-for="(item, index) in pedidosArray" :key="index">
            <td class="text-left">{{ item.nombre || item.producto }}</td>
            <td class="text-left">{{ item.cantidad }}</td>
            <td class="text-left">{{ item.precio }}</td>
            <td class="text-left">{{ item.precio * item.cantidad }}</td>
            <td class="text-left">
              <v-btn @click="deleteItem(item)" icon>
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </table>
    </v-col>

    <v-col cols="3" class="d-flex flex-row mb-5">
      <h2 class="mr-5">Precio Total</h2>
      <h1>{{ totalPorPedido }}</h1>
    </v-col>
  </v-row>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
import { mapGetters } from 'vuex'
export default defineComponent({
  data: () => ({
    productoSeleccionado: {
      nombre: '',
      precio: '',
    },
    cantidad: '',
    productos: [],
    pedidoproductos: [],
    pedidosArray: [],
    totalPorPedido: 0,
    isPedidoEmpty: false,
  }),
  computed: {
    ...mapGetters(['allProductos', 'allPedidosProductos']),
  },
  methods: {
    addItem() {
      this.productoSeleccionado.cantidad = this.cantidad
      this.pedidosArray.push(this.productoSeleccionado)
    },
    deleteItem(item) {
      console.log(item)
      this.pedidosArray = this.pedidosArray.filter((element) => {
        return element.productoId != item.productoId
      })
    },
  },
  watch: {
    totalPorPedido(newVal, oldVal) {
      if (newVal > 0) {
        this.$emit('input', newVal)
      } else {
        this.$emit('input', 0)
      }
    },
    pedidosArray(newVal, oldVal) {
      if (newVal.length > 0) {
        this.totalPorPedido = 0
        newVal.forEach((element) => {
          this.totalPorPedido = this.totalPorPedido + element.cantidad * element.precio
        })

        this.$emit('itemsSelected', newVal)
      } else {
        this.productoSeleccionado = { nombre: '', precio: '' }
        this.cantidad = 0
        this.totalPorPedido = 0
        this.$emit('itemsSelected', [])
      }
    },
  },
  created() {
    this.productos = this.allProductos
    this.pedidoproductos = this.allPedidosProductos
    console.log(this.productos)
  },
})
</script>