import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './styles/index.less'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI);

Vue.config.productionTip = false

/* 通过render方法把App根组件渲染到 #app 入口节点 */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
