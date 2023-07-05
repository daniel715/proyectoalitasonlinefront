<template>
  <v-dialog class="dialog" v-model="dialog" max-width="70%">
    <v-container class="ma-0 pa-0">
      <v-card>
        <div class="mx-auto pa-10" style="max-width: 70%">
          <div class="mx-auto">
            <!-- <v-img :src="mainImage" /> -->
          </div>
          <!-- <div class="pa-5">
            <v-img :src="mainImage" max-width="50%" />
          </div> -->
          <div class="d-flex row mt-8 ma-10" style="justify-content: space-between; display: flex; flex-flow: row wrap">
            <v-col class="d-flex flex-column" cols="6">
              <v-alert v-if="isDisponible" outlined type="success" text :icon="false"> Libro Disponible </v-alert>
              <v-alert v-else outlined type="warning" prominent> Libro actualmente no disponible </v-alert>
              <div class="property">
                <div class="propertyname">Titulo</div>
                {{ libro.nombre }}
              </div>
              <div class="property">
                <div class="propertyname">Autor</div>
                {{ libro.autor }}
              </div>
              <div class="property">
                <div class="propertyname">Año</div>
                {{ libro.year }}
              </div>
              <div class="property">
                <div class="propertyname">Precio</div>
                S/{{ libro.precio }}
              </div>
              <div class="property">
                <div class="propertyname">Categorias</div>
                <v-chip v-for="(item, index) in libro.categorias" :key="index" class="ma-2" color="pink" label text-color="white">
                  <v-icon class="mr-2">mdi-label</v-icon>
                    {{item}}
                </v-chip>
              </div>
            </v-col>
            <v-col style="text-align: left">
              <div class="property">
                <div class="propertyname">Descripcion</div>
                {{ libro.resumen }}
              </div></v-col
            >
          </div>
        </div>
      </v-card>
    </v-container>
  </v-dialog>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
export default defineComponent({
  props: {
    libro: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    dialog: false,
  }),
  computed: {
    // mainImage() {
    //   return this.libro.imageurl[this.libro.imageurl.length - 1]
    // },
    otherImages() {
      return this.libro.imageurl.filter((item) => {
        if (this.libro.imageurl.indexOf(item) != '0') return item
      })
    },
    isDisponible() {
      return this.libro.stock > 0
    },
  },
  created() {
    console.log('en dialogo libro', this.libro)
  },
})
</script>
<style scoped>
.property {
  margin-bottom: 20px;
}
.propertyname {
  font-weight: bold;
}
.dialog {
  height: 110vh;
}
</style>