<template>
  <div>
    <v-container v-if="!showAdmin" class="mt-10">
      <v-row justify="center">
        <v-col cols="4">
          <v-card>
            <v-card-text>
              <v-text-field
                :rules="[rules.required, rules.min]"
                :error="passwordError"
                v-model="password"
                type="password"
                autofocus
                @keydown.enter="entrar"
                label="Ingrese contrasena"
              >
              </v-text-field>
              <v-row class="ma-0" align-items="center" justify="center">
                <v-progress-linear :active="loading" :indeterminate="loading" color="blue"></v-progress-linear>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-else>
      <tab-crud />
    </v-container>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
// import { ref, defineComponent } from '@vue/composition-api'
import tabCrud from '@/components/TabCrud.vue'
export default defineComponent({
  components: {
    tabCrud,
  },
  data: () => ({
    loading: false,
    password: '',
    showAdmin: false,
    passwordError: false,
    rules: {
      required: (value) => !!value || 'Obligatorio',
      min: (v) => v.length >= 0 || 'Contrasena muy corta',
    },
  }),
  // setup() {
  //   const count = ref(0)
  //   return { count }
  // },
  methods: {
    entrar() {
      this.loading = true
      let delay = Math.random() * 2
      setTimeout(() => {
        if (this.password == '123') {
          this.showAdmin = true
          this.passwordError = false
        } else {
          this.showAdmin = false
          this.passwordError = true
        }
        this.loading = false
      }, 0)
    },
  },
})
</script>

<style scoped>
</style>