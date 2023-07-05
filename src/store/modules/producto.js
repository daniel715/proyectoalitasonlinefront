import axiosInstance from "@/plugins/axios";

const state = {
    productos: [],
};
const getters = {
    allProductos: (state) => state.productos
};
const actions = {
    async fetchProductos({ commit }) {
        const response = await axiosInstance.get("/producto/list")
        commit('setProductos', response.data)
    }
};
const mutations = {
    setProductos: (state, payload) => (state.productos = payload)
};

export default {
    state,
    getters,
    actions,
    mutations
}
