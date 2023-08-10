<template>
  <div
    class="d-flex text-center flex-column flex-grow-1"
    :style="{
      backgroundSize: 'cover',
      backgroundImage: `url(${image})`,
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
    }"
  >
    <v-container fill-height style="width: 80%; position: absolute; right: 1%">
      <v-row>
        <v-col cols="9">
          <div :class="success ? 'buscador-animation' : ''">
            <v-text-field
              v-model="select"
              @keydown.enter="buscar"
              @change="input"
              background-color="white"
              color="white"
              rounded
              height="40px"
              solo
              dense
              autofocus
              label="Buscar libro o autor"
            ></v-text-field>
            <v-progress-linear :active="loading" :indeterminate="loading" color="white"></v-progress-linear>
            <v-row justify="center">
              <v-chip-group active-class="primary--text">
                <v-chip
                  @click="buscarLibrosPorCategoria(categoria)"
                  v-for="categoria in categorias"
                  :key="categoria.id"
                  class="ma-2"
                  color="pink"
                  label
                  text-color="white"
                  style="opacity: 0.8"
                >
                  <v-icon class="mr-2" start icon="">mdi-label</v-icon>
                  {{ categoria.nombre }}
                </v-chip>
              </v-chip-group>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <transition name="fade" mode="out-in">
      <v-row v-if="showVisor" align="center" justify="center" style="max-height: 100vh">
        <v-col class="mt-15" cols="8">
          <div class="mt-15">
            <div class="visor-libro mt-15" style="height: 55vh; overflow-y: scroll">
              <visor-libro :items="items" ref="visorlibro" />
            </div>
          </div>
        </v-col>
      </v-row>
    </transition>
  </div>
</template>
  
<script>
import { ref, defineComponent } from '@vue/composition-api'
import { mapState } from 'vuex'
export default defineComponent({
  data: () => ({
    select: [],
    loading: false,
    success: false,
    items: [],
    param: '',
    response: [],
    categorias: [],
    showVisor: false,
  }),

  methods: {
    async buscar() {
      this.loading = true
      this.select = this.param
      console.log('buscando', this.select)
      this.response = await this.$axios.get('/libro/buscar/' + this.select)
      if (this.response.status == '200') this.success = true
      this.items = await this.parseImagesArrayToJson(this.response)
      setTimeout(() => {
        this.showVisor = true
        setTimeout(() => {
          this.$refs.visorlibro.items = this.items
        }, 500)
      }, 500)
      this.loading = false
    },
    async buscarLibrosPorCategoria(data) {
      this.loading = true
      this.response = await this.$axios.get('/libro/buscarporcategoria/' + data.id)
      if (this.response.status == '200') {
        this.success = true
        this.items = this.response.data
      }
      setTimeout(() => {
        this.showVisor = true
        setTimeout(() => {
          this.$refs.visorlibro.items = this.items
        }, 500)
      }, 500)
      this.loading = false
    },
    input(data) {
      this.param = data
    },
  },
  computed: {
    ...mapState(['isMobile']),

    image() {
      return this.isMobile
        ? '/fondo-login.jpg'
        : 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8Nnx8fGVufDB8fHx8&w=1000&q=80'
    },
    message() {
      if (this.param) return 'Resultados de busqueda para: ' + this.param
      else return ''
    },
  },
  created() {
    this.categorias = this.$store.state.categorias
  },
  setup() {
    const count = ref(0)
    return { count }
  },
})
</script>
  
<style scoped>
.buscador-animation {
  transform: translate(0px, -300px);
  transition: transform 2s;
}
.fade-enter-active,
.fade-leave-active {
  transition-duration: 1s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.visor-libro {
  background-color: rgba(247, 247, 247, 0.87);
  opacity: 0.8;
}
</style>
  