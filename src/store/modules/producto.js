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
    },
    async addProducto({ commit }, producto) {
        const response = await axiosInstance.post("/producto/save", producto)
        commit('newProducto', response.data)
        return response;
    },
    async updateProducto({ commit }, producto) {
        const response = await axiosInstance.patch("/producto/update/" + producto.productoId, producto)
        commit('updateProducto', response.data)
        return response;
    },
    async deleteProducto({ commit }, producto) {
        const response = await axiosInstance.delete("/producto/delete/" + producto.productoId)
        commit('deleteProducto', producto)
        return response;
    }
};
const mutations = {
    setProductos: (state, payload) => (state.productos = payload),
    newProducto: (state, producto) => state.productos.unshift(producto),
    updateProducto: (state, producto) => {
        for (let element of state.productos) {
            if (element.productoId == producto.productoId) {
                element.categoriaId = producto.categoriaId
                element.combo = producto.combo
                element.nombre = producto.nombre
                element.precio = producto.precio;
                element.productoId = producto.productoId;
                element.stock = producto.stock
            }
           }
    },
    deleteProducto: (state, producto) => state.productos = state.productos.filter(element => element.productoId !== producto.productoId)
};

export default {
    state,
    getters,
    actions,
    mutations
}
