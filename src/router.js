import { createRouter, createWebHashHistory } from 'vue-router'
import Login from './components/MyLogin.vue'
import Home from './components/MyHome.vue'
import Nodes from './components/menus/MyNodes.vue'
import ProcessChoice from './components/menus/MyProcessChoice.vue'
import NodeDetail from './components/nodes/MyNodeDetail.vue'
import ProcessDetail from './components/process/MyProcessDetail.vue'
const router = createRouter({
    history: createWebHashHistory(),
    routes:[
        {path:'/',redirect:'/login'},
        {path:'/login',component: Login},
        {path:'/home',component: Home,
         redirect:'/home/nodes',
         children:[
           { path:'nodes',component:Nodes},
           { path: 'processchoice', component: ProcessChoice },
           { path: 'process/:executionId', component: ProcessDetail , props: true},
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