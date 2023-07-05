import axiosInstance from "@/plugins/axios";

const state = {
    pedidos: [],
};
const getters = {
    allPedidos: (state) => state.pedidos,
};
const actions = {
    async fetchPedidos({ commit }) {
        const response = await axiosInstance.get("/pedido/list")
        commit('setPedidos', response.data)
    }
};
const mutations = {
    setPedidos: (state, payload) => (state.pedidos = payload),
};

export default {
    state,
    getters,
    actions,
    mutations
}
