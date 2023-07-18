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
    },
    async addCategoria({ commit }, categoria) {
        const response = await axiosInstance.post("/categoria/save", categoria)
        commit('newCategoria', response.data)
        return response;
    },
    async updateCategoria({ commit }, categoria) {
        const response = await axiosInstance.patch("/categoria/update/" + categoria.idCategoria, categoria)
        commit('updateCategoria', response.data)
        return response;
    },
    async deleteCategoria({ commit }, categoria) {
        const response = await axiosInstance.delete("/categoria/delete/" + categoria.idCategoria)
        commit('deleteCategoria', categoria)
        return response;
    }
};
const mutations = {
    setCategorias: (state, payload) => state.categorias = payload,
    newCategoria: (state, categoria) => state.categorias.unshift(categoria),
    updateCategoria: (state, categoria) => state.categorias.forEach(element => {
        if (element.idCategoria == categoria.idCategoria) element.nombre = categoria.nombre;
    }),
    deleteCategoria: (state, categoria) => state.categorias = state.categorias.filter(element => element.idCategoria !== categoria.idCategoria)
};

export default {
    state,
    getters,
    actions,
    mutations
}
