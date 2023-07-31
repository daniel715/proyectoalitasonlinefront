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
    },
    async addPedido({ commit }, pedido) {
        const response = await axiosInstance.post("/pedido/save", pedido)
        commit('newPedido', response.data)
        return response;
    },
    async updatePedido({ commit }, pedido) {
        const response = await axiosInstance.patch("/pedido/update/" + pedido.pedidoId, pedido)
        commit('updatePedido', response.data)
        return response;
    },
    async deletePedido({ commit }, pedido) {
        const response = await axiosInstance.delete("/pedido/delete/" + pedido.pedidoId)
        commit('deletePedido', pedido)
        return response;
    }
};
const mutations = {
    setPedidos: (state, payload) => (state.pedidos = payload),
    newPedido: (state, pedido) => state.pedidos.unshift(pedido),
    updatePedido: (state, pedido) => {
        for (let element of state.pedidos) {
            if (element.pedidoId == pedido.pedidoId) {
                element.fechaPedido = pedido.fechaPedido
                element.fechaEntrega = pedido.fechaEntrega
                element.fechaSalida = pedido.fechaSalida
                element.direccion = pedido.direccion;
                element.metodoPago = pedido.metodoPago;
                element.totalPagar = pedido.totalPagar;
                element.observacion = pedido.observacion;
                element.respuestaPagoApp = pedido.respuestaPagoApp
                element.status = pedido.status;
                element.direccionIp = pedido.direccionIp;
                element.montoRecibido = pedido.montoRecibido;
            }
        }
    },
    deletePedido: (state, pedido) => state.pedidos = state.pedidos.filter(element => element.pedidoId !== pedido.pedidoId)

};

export default {
    state,
    getters,
    actions,
    mutations
}
