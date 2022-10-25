import { createRouter, createWebHashHistory } from 'vue-router'
import Login from './components/MyLogin.vue'
import Home from './components/MyHome.vue'
import Nodes from './components/menus/MyNodes.vue'
import Flowcharts from './components/menus/MyFlowcharts.vue'
import ProcessChoice from './components/menus/MyProcessChoice.vue'
import Orders from './components/menus/MyOrders.vue'
import Settings from './components/menus/MySettings.vue'
import NodeDetail from './components/nodes/MyNodeDetail.vue'

const router = createRouter({
    history: createWebHashHistory(),
    routes:[
        {path:'/',redirect:'/login'},
        {path:'/login',component: Login},
        {path:'/home',component: Home,
         redirect:'/home/nodes',
         children:[
           { path:'nodes',component:Nodes},
           { path:'flowcharts',component:Flowcharts},
           { path: 'processchoice', component: ProcessChoice },
           { path: 'orders', component: Orders },
           { path: 'settings', component: Settings },
           { path: 'nodes/:id', component: NodeDetail , props: true},
         ]
        },
    ],
    })
    router.beforeEach((to,from,next) => {
    if(to.path ==='/login')
        return next();
    const token = localStorage.getItem('token')
    if(!token)
    {
        return next('/login');
    }
    next();
    })
export default router