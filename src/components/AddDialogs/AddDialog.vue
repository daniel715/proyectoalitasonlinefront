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
              <slot name="body"></slot>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <slot name="actions"></slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
export default defineComponent({
  props: {
    entidad: {
      type: String,
      default: '',
    },
  },
  data: () => ({ dialog: false, editedIndex: -1 }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? `Agregar ${this.entidad}` : `Editar ${this.entidad}`
    },
  },
  methods: {
    close() {
      this.dialog = false
      this.$emit('closeDialog')
    },
  },
})
</script>