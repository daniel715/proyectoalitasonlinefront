import axiosInstance from "@/plugins/axios";

const state = {
    categorias: [],
};
const getters = {
    allCategorias: (state) => state.categorias
};
const actions = {
    async fetchCategorias({ commit }) {
        const response = await axiosInstance.get("/categoria/list")
        commit('setCategorias', response.data)
    }
};
const mutations = {
    setCategorias: (state, payload) => (state.categorias = payload)
};

export default {
    state,
    getters,
    actions,
    mutations
}
