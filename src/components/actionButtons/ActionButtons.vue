<template>
  <div>
    <v-btn v-if="showVisor" icon color="blue" small class="mr-2" @click="openVisor()">
      <v-icon> mdi-eye </v-icon>
    </v-btn>
    <v-btn v-if="showEdit" icon color="yellow" small class="mr-2" @click="editItem()" elevation="2">
      <v-icon> mdi-pencil </v-icon>
    </v-btn>
    <v-btn v-if="showDelete" icon color="red" small @click="deleteItem()" elevation="2">
      <v-icon> mdi-delete </v-icon>
    </v-btn>
  </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
export default defineComponent({
  props: {
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

  methods: {
    openVisor() {},
    editItem() {},
    deleteItem() {},
  },
})
</script>