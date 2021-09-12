/* 粉丝管理相关请求模块 */
import request from '@/utils/request';

/* 获取粉丝列表 */
export const getFans = params => {
  return request({
    methods: 'GET',
    url: '/mp/v1_0/followers',
    /* 
      Body参数使用data设置
      Query参数使用params设置
      Headers参数使用headers设置 
    */
    params
  })
}
