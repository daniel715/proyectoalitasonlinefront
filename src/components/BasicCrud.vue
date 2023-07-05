<template>
  <div>
    <v-data-table :headers="headers" :items="itemsList" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Administrador {{ entidad }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-btn class="primary" @click="addItem()">Agregar</v-btn>
          <v-btn class="primary ml-5" @click="getItems()">Refrescar</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.resumen="{ item }">
        <!-- {{ item }} -->
        <!-- <span v-html="item.name"></span> -->
        <table density="compact">
          <thead>
            <th class="text-left">categoria</th>
            <th class="text-left">producto</th>
            <th class="text-left">precio</th>
            <th class="text-left">cantidad</th>
            <th class="text-left">total</th>
          </thead>
          <tbody>
            <tr v-for="element in item.resumen" :key="item.id">
              <td>{{ element.categoria }}</td>
              <td>{{ element.producto }}</td>
              <td>{{ element.precio }}</td>
              <td>{{ element.cantidad }}</td>
              <td>{{ element.total }}</td>
            </tr>
          </tbody>
        </table>
      </template>
      <template v-slot:item.actions="{ item }">
        <actionButtons :show-delete="showDelete" :show-edit="showEdit" :showVisor="showVisor" />
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
import AddLibroDialog from './AddDialogs/AddLibroDialog.vue'
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
    AddLibroDialog,
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
      console.log('editando item', item)
      this.editedIndex = this.items.indexOf(item) // para que cambie el titulo
      this.$emit('onEdit', item, this.editedIndex)
    },
    deleteItem(item) {
      this.$refs.confirmationDialog.dialog = true
      this.editedItem = item
    },

    async deleteItemConfirm() {
      this.$emit('onDelete', this.editedItem)
    },

    async getItems() {
      this.$emit('getItems')
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
th {
  width: 300px;
  margin: auto;
}
td {
  width: 300px;
  margin: auto;
}
</style>