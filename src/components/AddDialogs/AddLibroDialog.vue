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
              <v-text-field autofocus outlined v-model="tempItem.nombre" label="Titulo"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="8">
              <autor-combo @input="setAutorId" ref="autorCombo" />
            </v-col>
            <v-col cols="12" sm="6" md="8">
              <categoria-combo @input="setCategorias" ref="categoriaCombo" />
            </v-col>
            <v-col cols="12" sm="6" md="8">
              <v-text-field type="number" outlined v-model.number="tempItem.stock" label="Stock"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="8">
              <v-text-field type="number" outlined v-model.number="tempItem.precio" label="Precio"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="8">
              <v-textarea  outlined v-model="tempItem.resumen" label="Descripcion"></v-textarea>
            </v-col>
            <v-col cols="12" sm="6" md="8">
              <v-text-field outlined v-model="tempItem.year" label="Año"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="8">
              <image-input
                ref="imageInput"
                @input="formatImagesString"
                label="Foto"
                height="190px"
                width="280px"
                base64
              />
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
import AutorCombo from '@/components/combos/AutorCombo.vue'
import CategoriaCombo from '@/components/combos/CategoriaCombo.vue'
import ImageInput from '@/components/inputs/ImageInput.vue'
import { UUID } from 'uuidjs'
export default defineComponent({
  components: {
    AutorCombo,
    CategoriaCombo,
    ImageInput,
  },
  data: () => ({
    dialog: false,
    editedIndex: -1,
    imageArrayTemp: [],
    tempItem: {
      id: '',
      nombre: '',
      year: '',
      resumen: '',
      idAutor: '',
      precio: 0.0,
      stock: 0,
      imageurl: '',
      categoriasId: [],
      categorias: [],
    },
    editedItem: {
      id: '',
      nombre: '',
      year: '',
      resumen: '',
      idAutor: '',
      precio: 0.0,
      stock: 0,
      imageurl: '',
      categoriasId: [],
      categorias: [],
    },
    defaultItem: {
      id: '',
      nombre: '',
      year: '',
      resumen: '',
      idAutor: '',
      precio: 0.0,
      stock: 0,
      imageurl: '',
      categoriasId: [],
      categorias: [],
    },
    defaultPayload: {
      categorias: '',
      categoriasId: '',
      libroId: '',
    },
    payload: {},
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Agregar Libro' : 'Editar Libro'
    },
  },
  methods: {
    async save() {
      // editando libro
      if (this.editedIndex > -1) {
        this.setEditedItem()
        let respuesta = await this.$axios.patch('libro/update/' + this.editedItem.id, this.editedItem)
        console.log(respuesta)
        if (respuesta.status == '200') {
          this.payload.categorias = JSON.stringify(this.editedItem.categorias)
          this.parseString(JSON.stringify(this.editedItem.categoriasId))
          let response = await this.$axios.patch('librocategoria/update/' + this.editedItem.id, this.payload)
          if (response.status == '201') {
            this.refresh()
          }
        }
        this.refresh()
      } else {
        // creando libro nuevo
        this.editedItem.id = UUID.generate()
        this.setEditedItem()
        let response = await this.$axios.post('libro/save', this.editedItem)
        // console.log(response)
        if (response.status == '201') {
          this.payload.libroId = this.editedItem.id
          this.payload.categorias = JSON.stringify(this.editedItem.categorias)
          this.parseString(JSON.stringify(this.editedItem.categoriasId))
          let response = await this.$axios.post('librocategoria/save', this.payload)
          if (response.status == '201') {
            this.refresh()
          }
        }
      }
      this.close()
    },
    formatImagesString(data) {
      console.log('data', data)
      if (data != null) {
        let token = `${data}`
        this.imageArrayTemp.push(token)
        this.tempItem.imageurl = JSON.stringify(this.imageArrayTemp)
      }
    },
    setEditedItem() {
      this.editedItem.nombre = this.tempItem.nombre
      this.editedItem.year = this.tempItem.year
      this.editedItem.resumen = this.tempItem.resumen
      this.editedItem.idAutor = this.tempItem.idAutor
      this.editedItem.precio = this.tempItem.precio
      this.editedItem.stock = this.tempItem.stock
      this.editedItem.imageurl = this.tempItem.imageurl
      this.editedItem.categoriasId = this.tempItem.categoriasId
      this.editedItem.categorias = this.tempItem.categorias
    },
    parseString(data) {
      this.payload.categoriasId = data
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.tempItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
      this.imageArrayTemp = []
      this.payload = Object.assign({}, this.defaultPayload)
      this.$refs.autorCombo.selectedItem = {}
      this.$refs.categoriaCombo.select = []
      this.$refs.imageInput.url = null
      this.refresh()
    },
    setAutorId(data) {
      if (data != null) {
        console.log('en add item dialog', data)
        this.tempItem.idAutor = data
      }
    },
    async setCategorias(data) {
      if (data != null) {
        console.log(data)
        this.tempItem.categoriasId = await data.map((item) => item.id)
        this.tempItem.categorias = await data.map((item) => item.nombre)
      }
    },
    refresh() {
      this.$emit('refresh')
    },
    setAutorCombo() {
      console.log('seteando autor combo')
      setTimeout(() => {
        this.$refs.autorCombo.selectedItem = this.tempItem.idAutor
      }, 100)
    },
    setCategoriasCombo() {
      console.log('seteando categorias')
      console.log(this.tempItem)
      let categorias = []
      let index = 0
      this.tempItem.categoriasId.forEach((element) => {
        let object = {
          id: element,
          nombre: this.tempItem.categorias[index],
        }
        categorias.push(object)
        index = index + 1
      })

      setTimeout(() => {
        console.log('Item categorias', categorias)
        this.$refs.categoriaCombo.select = categorias
      }, 100)
    },
    setImageInput() {
      setTimeout(() => {
        let array = JSON.parse(this.tempItem.imageurl)
        this.$refs.imageInput.url = array[array.length - 1]
      }, 100)
      this.formatImagesString(this.tempItem.imageurl[this.tempItem.imageurl.length - 1])
    },
  },
})
</script>