<template>
  <div class="pa-5">
    <v-row>
      <v-col>
        <v-row>
          <v-col v-for="item in items" :key="item.id" class="d-flex child-flex" cols="3">
            <v-hover v-slot="{ hover }">
              <v-card
                :style="hover ? '' : 'opacity: 10'"
                :elevation="hover ? 5 : 0"
                :class="{ 'on-hover': hover }"
                class="pa-5"
                @click="openModal(item)"
              >
                <v-img src="https://img.freepik.com/vector-gratis/libro-blanco-sobre-fondo-blanco_1308-23052.jpg?w=2000" aspect-ratio="1">
                  <template v-slot:placeholder>
                    <v-row class="ma-0" align-items="center" justify="center">
                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
                <div class="my-2">
                  <p style="font-weight: bold; font-family:'Courier New', Courier, monospace">
                    {{ item.nombre }}
                  </p>
                </div>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <libro-dialog ref="modal" :libro="selectedLibro" />
  </div>
</template>
<script>
import LibroDialog from '@/components/LibroDialog.vue'
export default {
  components: {
    LibroDialog,
  },
  data: () => ({
    items: [],
    showModal: false,
    selectedLibro: {},
  }),
  methods: {
    openModal(data) {
      console.log('abriendo modal con data', data)
      this.selectedLibro = data
      setTimeout(() => {
        this.$refs.modal.dialog = true
      }, 500)
    },
  },
}
</script>
<style scoped>
.v-card {
  transition: opacity 0.4s ease-in-out;
  transition: transform 0.6s;
}

.v-card:hover {
  transform: scale(1.2);
  cursor: pointer;
}

.v-card:not(.on-hover) {
  opacity: 5;
}
</style>