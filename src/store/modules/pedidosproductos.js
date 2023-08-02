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
    },
    async addPedidoProducto({ commit }, pedidoProducto) {
        const response = await axiosInstance.post("/pedidoproducto/save", pedidoProducto)
        commit('newPedidoProducto', response.data)
        return response;
    },
    async updatePedidoProducto({ commit }, pedidoProducto) {
        const response = await axiosInstance.patch("/pedidoproducto/update/" + pedido.pedidoId, pedido)
        commit('updatePedido', response.data)
        return response;
    },
    async deletePedidoProducto({ commit }, pedidoId) {
        const response = await axiosInstance.delete("/pedidoproducto/delete/" + pedidoId )
        commit('deletePedidoProducto', pedidoId)
        return response;
    }
};
const mutations = {
    setPedidosProductos: (state, payload) => (state.pedidosproductos = payload),
    newPedidoProducto: (state , pedidoproducto) =>  state.pedidosproductos.unshift(pedidoproducto),
    deletePedidoProducto: (state, pedidoId) => state.pedidosproductos = state.pedidosproductos.filter(element => element.pedidoId !== pedidoId)
};

export default {
    state,
    getters,
    actions,
    mutations
}
