<template>
  <v-card>
    <v-toolbar color="blue" dark flat>
      <v-toolbar-title>Control de caja</v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-slot:extension>
        <v-tabs v-model="tab" align-with-title>
          <v-tabs-slider color="yellow"></v-tabs-slider>

          <v-tab v-for="item in items" :key="item">
            {{ item }}
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in items" :key="item">
        <v-card v-if="item == 'Pedidos'" flat>
          <pedido-crud />
        </v-card>
        <v-card v-else-if="item == 'Menu'">
          <menu-crud />
        </v-card>
        <v-card v-else-if="item == 'Compacto'"> <compacto /> </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script>
import { ref, defineComponent } from '@vue/composition-api'
import basicCrud from '@/components/BasicCrud.vue'
import categoriaCrud from '@/components/businesscruds/CategoriaCrud.vue'
import menuCrud from '@/components/businesscruds/MenuCrud.vue'
import pedidoCrud from '@/components/businesscruds/PedidoCrud.vue'
import Compacto from './businesscruds/Compacto.vue'
export default defineComponent({
  components: {
    basicCrud,
    categoriaCrud,
    menuCrud,
    pedidoCrud,
    Compacto
  },
  data: () => ({
    tab: null,
    items: ['Pedidos', 'Menu'],
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  }),
  methods: {},
})
</script>