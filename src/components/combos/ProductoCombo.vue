<template>
  <v-row>
    <v-col>
      <table>
        <thead>
          <th>Producto</th>
          <th>Precio</th>
          <th>Cantidad</th>
          <th>Total</th>
          <th></th>
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
              ></v-combobox>
            </td>
            <td>{{ productoSeleccionado.precio }}</td>
            <td>
              <v-text-field type="number" v-model="cantidad" label=""></v-text-field>
            </td>
            <td>{{ productoSeleccionado.precio * cantidad }}</td>
            <td>
              <v-btn @click="addItem" small icon>
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </table>
    </v-col>
    <v-col>
      <span style="display: block" v-for="(item, index) in pedidosArray" :key="index">
        {{ item.nombre }}
        {{  item.cantidad }}
        <v-btn @click="deleteItem(item)" icon>
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </span>
    </v-col>
    <v-col>
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
  }),
  computed: {
    ...mapGetters(['allProductos', 'allPedidosProductos']),
  },
  methods: {
    addItem() {
      this.productoSeleccionado.cantidad = this.cantidad
      this.pedidosArray.push(this.productoSeleccionado)
      this.totalPorPedido = this.totalPorPedido + this.productoSeleccionado.cantidad * this.productoSeleccionado.precio
    },
    deleteItem(item) {
      console.log(item)
      this.pedidosArray = this.pedidosArray.filter((element) => {
        return element.productoId != item.productoId
      })
      this.totalPorPedido = this.totalPorPedido - item.cantidad * item.precio
    },
  },
  watch: {
    totalPorPedido(newVal, oldVal) {
      console.log('elemento seleccionado', newVal)
      this.$emit('input', newVal)
    },
    pedidosArray(newVal, oldVal){
      this.$emit('itemsSelected', newVal)
    }
    // setItems() {
    //   this.productos.forEach((producto) => {
    //     this.pedidoproductos.forEach((element) => {
    //       if (producto.productoId == element.productoId) {
    //         console.log(element)
    //         producto['cantidad'] = element.precio
    //       }
    //     })
    //   })
    // },
  },
  created() {
    this.productos = this.allProductos
    this.pedidoproductos = this.allPedidosProductos
    // this.setItems()
    console.log(this.productos)
  },
})
</script>