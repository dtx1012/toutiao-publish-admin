/*
  全局通信总线
  呼叫中心
  作用：可以让人和组件之间相互通信
 */
import Vue from 'vue';
export default new Vue()



//假设a组件要给b组件发送时数据

//b注册通信的组件
/* import glovalBus from '@/util/global-bus';
glovalBus.$on('自定义事件名称', (data) => {
  //处理函数
}) */
//a发布通信事件
/* import glovalBus from '@/util/global-bus';
glovalBus.$emit('自定义事件名称', 123456) */


// 注意： 通信两端使用的事件名称必须一致
//反之，b给a发送数据，a注册事件，b发布
