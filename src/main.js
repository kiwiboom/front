import { createApp } from 'vue'
import App from './App.vue'
import Vant from 'vant'
// import '../node_modules/vant/lib/vant-css/index.css'
// 导入 bootstrap 样式表
import './assets/css/bootstrap.css'
// 导入全局自定义样式表
import './index.css'
import router from './router'
//引入elementPlus
import ElementPlus from 'element-plus';
import '../node_modules/element-plus/dist/index.css';
// 创建 app 实例
const app = createApp(App)
app.use(router)
app.use(ElementPlus)
//引入vant
app.use(Vant)
// 挂载 app 实例
app.mount('#app')
