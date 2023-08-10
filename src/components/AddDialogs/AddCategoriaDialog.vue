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
              <v-text-field
                @keydown.enter="save"
                autofocus
                outlined
                v-model="editedItem.nombre"
                @input="input"
                label="Nombre"
              ></v-text-field>
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
import { mapActions } from 'vuex'
export default defineComponent({
  data: () => ({
    dialog: false,
    editedIndex: -1,
    nombre: '',
    editedItem: {
      idCategoria: '',
      nombre: '',
    },
    defaultItem: {
      idCategoria: '',
      nombre: '',
    },
    entidad: 'categoria',
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Agregar Categoria' : 'Editar Categoria'
    },
  },
  methods: {
    ...mapActions(['addCategoria', 'updateCategoria']),
    input(data) {
      console.log(data)
      this.nombre = data
    },
    async save() {
      console.log(this.editedIndex)
      //editando categoria
      if (this.editedIndex > -1) {
        this.editedItem.nombre = this.nombre
        let response = await this.updateCategoria(this.editedItem)
        if (response.status == '201') {
          console.log('actualizado con exito')
        }
      } else {
        //creando nueva categoria
        const dateString = Date.now().toString(36)
        const randomness = Math.random().toString(36).substr(2)
        const uniqueId = dateString + randomness
        this.editedItem.idCategoria = uniqueId
        this.editedItem.nombre = this.nombre
        let response = await this.addCategoria(this.editedItem)
        if (response.status == '201') {
          console.log('guardado con exito')
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