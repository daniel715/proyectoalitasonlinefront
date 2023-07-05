import axiosInstance from "@/plugins/axios";

const state = {
    pedidosproductos: [],
};
const getters = {
    allPedidosProductos: (state) => state.pedidosproductos
};
const actions = {
    async fetchPedidosProductos({ commit }) {
        const response = await axiosInstance.get("/pedidoproducto/list")
        commit('setPedidosProductos', response.data)
    }
};
const mutations = {
    setPedidosProductos: (state, payload) => (state.pedidosproductos = payload)
};

export default {
    state,
    getters,
    actions,
    mutations
}
