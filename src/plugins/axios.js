import axios from "axios";
// import Vue from "vue";

/**
 * creación de axios como prototipo para llmarlo con "this.$axios"
 * NOTA -. ESTO SOLO APLICA PARA LOS COMPONENTES HIJOS DE VUE
 * MAS NO PARA LA STORE
 */

// export default Vue.prototype.$axios = axios.create({
//   baseURL: "http://localhost:8080/",
//   timeout: 30000,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json"
//   },
//   onUploadProgress: progressEvent => {
//     const { total, loaded } = progressEvent;
//     const percent = Math.round((loaded * 100) / total);
//   }
// });

const instance = axios.create({
  baseURL: 'http://localhost:8080/',
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  },

});

export default instance;