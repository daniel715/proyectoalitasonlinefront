<template>
  <v-card>
    <v-toolbar color="blue" dark flat>
      <v-tabs v-model="tab" align-with-title background-color="blue" color="white">
        <v-tabs-slider color="yellow"></v-tabs-slider>
        <v-tab v-for="item in items" :key="item">
          {{ item }}
        </v-tab>
      </v-tabs>
    </v-toolbar>

    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in items" :key="item">
        <v-card v-if="item == 'Categorias'" flat>
          <categoria-crud />
        </v-card>
        <v-card v-else-if="item == 'Producto'">
          <carta-crud />
        </v-card>
        <v-card v-else-if="item == 'Combos'"> <combo-crud/> </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script>
import { ref, defineComponent } from '@vue/composition-api'
import CartaCrud from './CartaCrud.vue'
import CategoriaCrud from './CategoriaCrud.vue'
import ComboCrud from './ComboCrud.vue'
export default defineComponent({
  components: { CategoriaCrud, CartaCrud, ComboCrud },
  data: () => ({
    tab: null,
    items: ['Categorias', 'Producto', 'Combos'],
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  }),
})
</script>