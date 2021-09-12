/* 基于 axios 封装的请求模块 */
import axios from 'axios'
import router from '@/router'

//非组件模块加载使用提示
import {
  Message
} from 'element-ui';

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
request.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  const {
    status
  } = error.response
  // 对响应错误做点什么
  if (status && status.status === 401) {
    //跳转到登录页面
    //清除本地存储中的用户登陆状态
    window.localStorage.removeItem('user')
    router.push('/login')
    Message('登陆状态无效，请重新登录')
  } else if (status.status === 403) {
    //token未携带或者=已过期
    Message({
      type: 'warning',
      message: '没有操作权限'
    })
  } else if (status.status >= 400) {
    //客户端参数错误
    Message('请求参数错误')
  } else if (status.status >= 500) {
    //服务端错误
    Message('服务端内部异常，请稍后再试')
  }
  return Promise.reject(error);
});
//导出请求方法
export default request
