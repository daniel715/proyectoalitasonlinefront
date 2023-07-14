import axiosInstance from "@/plugins/axios";

const state = {
    totalPorPedido: [],
};
const getters = {
    alltotalPorPedido: (state) => state.totalPorPedido
};
const actions = {
    async fetchTotalPorPedido({ commit }) {
        console.log("trayendo total por pedidoss")
        const response = await axiosInstance.get("/pedidoproducto/listTotalPorPedido")
        commit('settotalPorPedido', response.data)
    }
};
const mutations = {
    settotalPorPedido: (state, payload) => (state.totalPorPedido = payload)
};

export default {
    state,
    getters,
    actions,
    mutations
}


/*
la  forma de los elmetos del array alltotalPorPedido es, los pedidosId si se pueden repetir
[
    {
        "pedidoId": "1",
        "precioTotal": 48.00
    },
    {
        "pedidoId": "2",
        "precioTotal": 80.00
    },
    {
        "pedidoId": "1",
        "precioTotal": 64.00
    },
    {
        "pedidoId": "2",
        "precioTotal": 80.00
    }
]

*/