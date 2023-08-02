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
      <span style="display: block" v-for="(item, index) in pedidosArray" :key="index">
        <div class="mr-5">
          {{ item.nombre || item.producto }}
          {{ item.cantidad }}
          <v-btn @click="deleteItem(item)" icon>
            <v-icon color="red">mdi-delete</v-icon>
          </v-btn>
        </div>
      </span>
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
    isPedidoEmpty: false
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
      if (newVal > 0) {
        this.$emit('input', newVal)
      }else{
        this.isPedidoEmpty = true
      }
    },
    pedidosArray(newVal, oldVal) {
      if (newVal.length > 0) {
        this.$emit('itemsSelected', newVal)
      }else{
        this.isPedidoEmpty = true
      }
    },
    isPedidoEmpty(newVal , oldVal){
      if(newVal){
        this.$emit('pedidosEmpty')
      }
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