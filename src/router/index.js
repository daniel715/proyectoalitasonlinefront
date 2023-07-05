import Vue from 'vue';
import VueRouter from 'vue-router';
import Index from '@/views/Index.vue';
import admin from '@/views/Admin.vue'
import app from '@/App.vue'
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index,
    meta: {
        layout: "index"
    }
  },
  {
    path: '/admin',
    name: 'admin',
    component: admin,
    meta: {
        layout: "admin"
    }
  }
];

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes
});


export default router;
