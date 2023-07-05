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
              <v-text-field @keydown.enter="save" autofocus outlined v-model="nombre" @input="input" label="Nombre"></v-text-field>
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
import { UUID } from 'uuidjs'
export default defineComponent({
  data: () => ({
    dialog: false,
    editedIndex: -1,
    nombre: '',
    editedItem: {
      id: '',
      nombre: '',
    },
    defaultItem: {
      id: '',
      nombre: '',
    },
    entidad: 'autor',
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Agregar Autor' : 'Editar Autor'
    },
  },
  methods: {
    input(data) {
      console.log(data)
      this.nombre = data
    },
    async save() {
      console.log(this.editedIndex)
      //editando autor
      if (this.editedIndex > -1) {
        this.editedItem.nombre = this.nombre
        let respuesta = await this.$axios.patch(this.entidad + '/update/' + this.editedItem.id, this.editedItem)
        console.log(respuesta)
        if (respuesta.status == '201') {
        }
      } else {
        //creando nuevo autor
        this.editedItem.id = UUID.generate()
        this.editedItem.nombre = this.nombre
        let response = await this.$axios.post(this.entidad + '/save', this.editedItem)
        if (response.status == '201') {
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