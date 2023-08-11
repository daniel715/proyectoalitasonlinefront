<template>
  <div>
    <v-data-table :headers="headers" :items="itemsList" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Administrador {{ entidad }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-btn class="primary" @click="addItem()">Agregar</v-btn>
          <div v-if="totalVentas > 0" class="d-flex flex-row">
            <h2 class="ml-5">Total Ventas</h2>
            <h2 class="ml-5"> S/ {{ totalVentas }}</h2>
          </div>

          <!-- <v-btn class="primary ml-5" @click="getItems()">Refrescar</v-btn> -->
        </v-toolbar>
      </template>
      <template v-slot:item.resumen="{ item }">
        <table class="fixed" density="compact">
          <thead>
            <th class="text-left">Categoria</th>
            <th style="width: 25vw" class="text-left">Producto</th>
            <th style="width: 4vw" class="text-left">Precio</th>
            <th style="width: 4vw" class="text-left">Cantidad</th>
            <th style="width: 4vw" class="text-left">Total</th>
          </thead>
          <tbody>
            <tr v-for="element in item.resumen" :key="element.id">
              <td>{{ element.categoria }}</td>
              <td style="width: 25vw">{{ element.producto }}</td>
              <td style="width: 4vw">{{ element.precio }}</td>
              <td style="width: 4vw">{{ element.cantidad }}</td>
              <td style="width: 4vw">{{ element.total }}</td>
            </tr>
          </tbody>
        </table>
      </template>
      <template v-slot:item.actions="{ item }">
        <actionButtons
          @onDelete="deleteItem(item)"
          @onEdit="editItem(item)"
          :show-delete="showDelete"
          :show-edit="showEdit"
          :showVisor="showVisor"
        />
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="refresh()">Recargar</v-btn>
      </template>
    </v-data-table>
    <confirmation-dialog @onConfirm="deleteItemConfirm()" ref="confirmationDialog" />
  </div>
</template>
<script>
import addItemDialog from '@/components/dialogs/AddItemDialog.vue'
import confirmationDialog from './dialogs/ConfirmationDialog.vue'
import { defineComponent } from '@vue/composition-api'
import ActionButtons from './actionButtons/ActionButtons.vue'
export default defineComponent({
  name: 'basicCrud',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    headers: {
      type: Array,
      default: () => [],
    },
    entidad: {
      type: String,
      default: '',
    },
    totalVentas: {
      type: Number,
      default: 0,
    },
    showVisor: {
      type: Boolean,
      default: false,
    },
    showEdit: {
      type: Boolean,
      default: false,
    },
    showDelete: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    addItemDialog,
    confirmationDialog,
    ActionButtons,
  },
  data: () => ({
    dialog: false,
    editedIndex: -1,
    editedItem: '',
  }),
  computed: {
    itemsList: {
      get: function () {
        return this.items
      },
      set: function (value) {
        this.$emit('listchange', value)
      },
    },
  },
  methods: {
    addItem() {
      this.$emit('onAdd')
    },
    editItem(item) {
      this.editedIndex = this.itemsList.indexOf(item) // para que cambie el titulo
      this.$emit('onEdit', item, this.editedIndex)
    },
    deleteItem(item) {
      console.log(item)
      this.$refs.confirmationDialog.dialog = true
      this.editedItem = item
    },

    async deleteItemConfirm() {
      this.$emit('onDelete', this.editedItem)
    },

    async getItems() {
      this.$emit('refresh')
    },
    refresh() {
      this.getItems()
    },
  },
  created() {
    this.getItems()
  },
})
</script>
<style scoped>
table {
  width: 50vw;
}
</style>