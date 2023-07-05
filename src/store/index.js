import Vue from 'vue';
import Vuex from 'vuex';
import pedidos from "./modules/pedido"
import productos from "./modules/producto"
import categorias from "./modules/categoria"
import pedidos_productos from './modules/pedidosproductos'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { pedidos, productos, categorias, pedidos_productos },
  state:{
    app:{
      isMobile : false
    }
  }
});
