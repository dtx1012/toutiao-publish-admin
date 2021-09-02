/* 基于 axios 封装的请求模块 */
import axios from 'axios'

//创建一个axios实例，就是复制了一个 axios 我们通过这个实例去发送请求，把需要的配置给这个实例来处理
const request = axios.create({
  /* baseURL: ' http://ttapi.research.itcast.cn' */
  baseURL: ' http://api-toutiao-web.itheima.net/' //请求的基础路径
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  //config是当前请求的相关配置信息对象
  //config是可以修改的
  const user = JSON.parse(window.localStorage.getItem('user'))
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  //return之后请求才会真正发出去
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

//响应拦截器

//导出请求方法
export default request
